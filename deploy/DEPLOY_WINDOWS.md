# Nova Core 部署指南 - Windows 环境

## 🚨 当前问题

由于 Windows Docker Desktop 的网络限制，宿主机应用无法连接到 Docker 容器中的 PostgreSQL 数据库。

## ✅ 推荐解决方案

### 方案 1: 使用本地 PostgreSQL（推荐）

```powershell
# 1. 下载 PostgreSQL for Windows
# https://www.postgresql.org/download/windows/

# 2. 安装时设置：
#    密码: nova_password
#    端口: 5432
#    用户: nova (需手动创建)

# 3. 创建数据库和用户
# 在 PowerShell 中运行（管理员）：
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE USER nova WITH PASSWORD 'nova_password';"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE nova_core OWNER nova;"
& "C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U nova nova_core

# 4. 创建数据表
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U nova -d nova_core -f init-tables.sql

# 5. 启动应用
npm run dev
```

### 方案 2: 使用 Docker 完整部署

等待 Node 镜像下载完成后：

```bash
# 1. 检查下载状态
docker images | grep node

# 2. 构建并启动所有服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f app
```

### 方案 3: 使用云数据库

```bash
# 使用阿里云 RDS、AWS RDS 等云数据库
# 修改 .env 文件：
DATABASE_URL=postgresql://user:pass@云数据库地址:5432/nova_core

# 启动应用
npm run dev
```

## 📝 数据库初始化脚本

创建 `init-tables.sql`:

```sql
-- Users 表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  phone_verified BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens 表
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth accounts 表
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  scope TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id)
);

-- SMS audit logs 表
CREATE TABLE IF NOT EXISTS sms_audit_logs (
  id TEXT PRIMARY KEY,
  phone TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 测试 API

```powershell
# 健康检查
curl http://localhost:3000/health

# 用户注册
curl -X POST http://localhost:3000/auth/register `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","email":"admin@nova.com","password":"Admin123!"}'

# 用户登录
curl -X POST http://localhost:3000/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"Admin123!"}'
```

## 📊 当前服务状态

```
✅ PostgreSQL (Docker): 运行中，端口 5432
✅ Redis (Docker): 运行中，端口 6379  
✅ 应用 (本地): 运行中，端口 3000
✅ 健康检查: http://localhost:3000/health
⚠️  数据库连接: 需要解决网络问题
```

## 🎯 快速启动命令

```powershell
# 停止所有 Node 进程
taskkill /F /IM node.exe

# 启动应用
npm run dev

# 查看日志
# 日志会直接显示在控制台
```

## 📞 需要帮助？

如果遇到问题，请：
1. 检查 PostgreSQL 服务是否运行
2. 验证 .env 文件中的 DATABASE_URL 配置
3. 确认端口 5432 未被占用
4. 查看应用日志中的详细错误信息
