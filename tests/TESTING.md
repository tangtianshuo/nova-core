# Refresh Token 测试指南

## 环境准备

### 1. 配置数据库

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
```

**.env 文件内容：**
```bash
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-for-security
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nova_core
NODE_ENV=development
```

### 2. 启动 PostgreSQL

使用 Docker：
```bash
docker run --name nova-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nova_core -p 5432:5432 -d postgres:16
```

或使用本地 PostgreSQL。

### 3. 运行数据库迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 运行迁移（创建 refresh_tokens 表）
npx prisma migrate dev --name add_refresh_tokens

# 或使用 push（开发环境，直接同步 schema）
npx prisma db push
```

### 4. 启动后端服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

后端运行在 `http://localhost:3000`

---

## 测试方法

### 方法 1: 使用 Web Demo

```bash
# Terminal 1: 启动后端
npm run dev

# Terminal 2: 启动 Web Demo
cd front
npm install
npm run dev
```

访问 `http://localhost:5173/auth` 进行登录测试。

---

### 方法 2: 使用 cURL 命令

#### 测试 1: 登录获取令牌

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123"}'
```

**预期响应：**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6...",
  "expiresIn": "1h"
}
```

保存这两个 token 用于后续测试。

#### 测试 2: 使用 Access Token 验证

```bash
# 替换 YOUR_ACCESS_TOKEN
curl -X POST http://localhost:3000/auth/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**预期响应：**
```json
{
  "valid": true,
  "user": {
    "userId": "...",
    "username": "..."
  }
}
```

#### 测试 3: 刷新令牌

```bash
# 替换 YOUR_REFRESH_TOKEN
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

**预期响应：**
```json
{
  "accessToken": "新的访问令牌",
  "refreshToken": "新的刷新令牌",
  "expiresIn": "1h"
}
```

旧的 refresh token 已被撤销。

#### 测试 4: 退出登录

```bash
# 替换 YOUR_ACCESS_TOKEN 和 YOUR_REFRESH_TOKEN
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

**预期响应：**
```json
{
  "message": "Logged out successfully"
}
```

#### 测试 5: 验证令牌撤销后再刷新

```bash
# 使用已撤销的 refresh token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REVOKED_REFRESH_TOKEN"}'
```

**预期响应：**
```json
{
  "error": "Invalid refresh token"
}
```

或

```json
{
  "error": "Refresh token has been revoked"
}
```

---

### 方法 3: 使用 Postman

导入以下集合到 Postman：

```json
{
  "info": {
    "name": "Nova Auth API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "url": "{{base_url}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"test@example.com\",\"password\":\"test123\"}"
        }
      }
    },
    {
      "name": "Validate Token",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{access_token}}"}
        ],
        "url": "{{base_url}}/auth/validate"
      }
    },
    {
      "name": "Refresh Token",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "url": "{{base_url}}/auth/refresh",
        "body": {
          "mode": "raw",
          "raw": "{\"refreshToken\":\"{{refresh_token}}\"}"
        }
      }
    },
    {
      "name": "Logout",
      "request": {
        "method": "POST",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{access_token}}"}
        ],
        "url": "{{base_url}}/auth/logout",
        "body": {
          "mode": "raw",
          "raw": "{\"refreshToken\":\"{{refresh_token}}\"}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "access_token",
      "value": "从登录响应复制"
    },
    {
      "key": "refresh_token",
      "value": "从登录响应复制"
    }
  ]
}
```

---

## 数据库验证

### 查看 refresh_tokens 表

```bash
# 使用 Prisma Studio
npx prisma studio

# 或使用 psql
psql postgres://postgres:postgres@localhost:5432/nova_core

# 查询 refresh tokens
SELECT id, token, user_id, expires_at, revoked_at, created_at 
FROM refresh_tokens;
```

### 验证令牌轮换

1. 登录获取 refresh token
2. 记录数据库中的 token（哈希值）
3. 调用 refresh 接口
4. 查看数据库：
   - 旧 token 的 `revoked_at` 应该被设置
   - 应该有新的 token 记录

---

## 测试场景清单

| 场景 | 预期结果 |
|------|---------|
| 正常登录 | 返回 accessToken + refreshToken |
| 使用有效 accessToken 验证 | 返回用户信息 |
| 使用有效 refreshToken 刷新 | 返回新的 token 对 |
| 刷新后旧 token 被撤销 | 旧 token 无法再次使用 |
| 正常退出登录 | refresh token 被撤销 |
| 使用已撤销的 token | 返回错误 |
| 过期的 refresh token | 返回错误 |
| 无效的 refresh token | 返回错误 |
| Access Token 过期后自动刷新 | SDK 自动刷新并重试 |

---

## 常见问题

### 1. "DATABASE_URL not found"

**原因**: 未配置环境变量或未运行迁移

**解决**:
```bash
# 创建 .env 文件
cp .env.example .env

# 运行迁移
npx prisma migrate dev --name add_refresh_tokens
```

### 2. "Invalid refresh token"

**原因**: Token 已被撤销、过期或不存在

**解决**: 重新登录获取新 token

### 3. "Prisma Client not generated"

**解决**:
```bash
npx prisma generate
```

---

## 完整测试脚本

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Nova Auth Refresh Token 测试 ==="

echo -e "\n1. 登录..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test@example.com","password":"test123"}')

echo "$LOGIN_RESPONSE" | jq .

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r .accessToken)
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r .refreshToken)

echo -e "\n2. 验证 Access Token..."
curl -s -X POST $BASE_URL/auth/validate \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

echo -e "\n3. 刷新令牌..."
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq .

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r .accessToken)
NEW_REFRESH_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r .refreshToken)

echo -e "\n4. 使用旧 refresh token（应该失败）..."
curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" | jq .

echo -e "\n5. 退出登录..."
curl -s -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$NEW_REFRESH_TOKEN\"}" | jq .

echo -e "\n6. 验证已撤销的 token（应该失败）..."
curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$NEW_REFRESH_TOKEN\"}" | jq .

echo -e "\n=== 测试完成 ==="
```

保存为 `test-refresh-token.sh` 并运行：
```bash
chmod +x test-refresh-token.sh
./test-refresh-token.sh
```
