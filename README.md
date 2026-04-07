# Nova Core

为 C/S 客户端工程搭建的 B/S 架构用户登录认证系统，包含管理端后台和客户端对接服务。作为独立的认证中心，管理用户登录、令牌验证和后台管理功能。

## 特性

- 用户注册与登录（JWT 认证）
- Token 自动刷新机制
- OAuth 第三方登录支持（GitHub）
- TypeScript SDK（支持 Web、Tauri 桌面应用）
- 完整的管理后台 API
- RESTful API 设计

## 技术栈

| 技术 | 用途 |
|------|------|
| Node.js + Express | 后端服务 |
| TypeScript | 开发语言 |
| PostgreSQL + Prisma | 数据库 |
| JWT + bcrypt | 认证与加密 |
| Redis | Token 缓存（可选） |

## 项目结构

```
nova-core/
├── src/                    # 主应用源码
│   ├── app.ts             # Express 入口
│   ├── config/            # 配置
│   └── modules/           # 功能模块
│       └── auth/          # 认证模块
├── nova-auth-sdk/         # 客户端 SDK
│   ├── src/               # SDK 源码
│   └── dist/              # 编译输出
├── web-demo/              # Web 示例应用
├── prisma/                # 数据库 Schema
├── scripts/               # 工具脚本
├── docs/                  # 文档
└── openapi.yaml           # OpenAPI 规范
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 配置数据库连接等信息
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma migrate dev

# 创建初始用户
npm run create-user
```

### 4. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

服务启动后，API 文档地址：
- Swagger UI: http://localhost:3000/api-docs
- OpenAPI 规范: http://localhost:3000/openapi.yaml

## 开发脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式启动 |
| `npm run build` | 编译 TypeScript |
| `npm start` | 生产环境启动 |
| `npm run create-user` | 创建测试用户 |
| `npm run docs:check` | 验证 OpenAPI 规范 |
| `npx prisma studio` | 打开 Prisma 数据库管理 |

## API 端点

### 认证

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/login` | 用户登录 |
| POST | `/auth/logout` | 登出 |
| POST | `/auth/refresh` | 刷新 Token |
| POST | `/auth/validate` | 验证 Token |

### OAuth

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/auth/oauth/:provider/login` | 获取 OAuth URL |
| POST | `/auth/oauth/link` | 绑定 OAuth 账户 |
| POST | `/auth/oauth/unlink` | 解绑 OAuth 账户 |
| GET | `/auth/oauth/accounts` | 获取已绑定账户 |

详细 API 文档请参考 [API.md](./API.md)。

## 客户端 SDK

提供 TypeScript SDK 供客户端使用，支持 Web、Tauri 等平台。

### 安装

```bash
npm install @nova-core/auth-sdk
```

### 使用示例

```typescript
import { AuthClient } from '@nova-core/auth-sdk';

const client = new AuthClient({
  baseURL: 'http://localhost:3000',
});

// 登录
const result = await client.login({
  username: 'user@example.com',
  password: 'password123',
});

// 验证登录状态
const validation = await client.validateToken();
console.log(validation.user);

// 登出
await client.logout();
```

详细文档请参考 [nova-auth-sdk/PUBLISH.md](./nova-auth-sdk/PUBLISH.md)。

## 配置

配置文件位于 `config.yaml`，支持以下配置项：

```yaml
app:
  host: "0.0.0.0"
  port: 3000
  env: development

database:
  url: "postgresql://user:password@localhost:5432/nova"

jwt:
  secret: "your-secret-key"
  accessTokenExpiry: "1h"
  refreshTokenExpiry: "7d"

redis:
  url: "redis://localhost:6379"
```

## 安全措施

- 密码使用 bcrypt 加密存储
- JWT Access Token 短期有效（默认 1 小时）
- Refresh Token 长期有效（默认 7 天）
- 登录接口限流防止暴力破解
- HTTP 安全头（HSTS、CSP 等）
- CORS 跨域控制

## 许可证

ISC
