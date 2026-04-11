# Nova Core 快速部署指南

## 🚀 快速开始

### 前置条件

确保已安装：
- Docker Desktop for Windows (推荐最新版本)
- Git

### 一键部署

```powershell
# 1. 构建镜像（首次运行需要）
deploy.bat build

# 2. 启动开发环境
deploy.bat dev

# 3. 检查服务状态
deploy.bat status

# 4. 健康检查
deploy.bat health
```

## 📋 可用命令

| 命令 | 说明 |
|------|------|
| `deploy.bat build` | 构建 Docker 镜像 |
| `deploy.bat dev` | 启动开发环境 |
| `deploy.bat prod` | 启动生产环境 |
| `deploy.bat start` | 启动服务 |
| `deploy.bat stop` | 停止服务 |
| `deploy.bat restart` | 重启服务 |
| `deploy.bat logs [srv]` | 查看日志 |
| `deploy.bat status` | 服务状态 |
| `deploy.bat health` | 健康检查 |

## 🔗 访问地址

启动成功后可以访问：

- **API 服务**: http://localhost:3000
- **健康检查**: http://localhost:3000/health
- **API 文档**: http://localhost:3000/api-docs

## 🧪 测试 API

### 用户注册
```powershell
curl -X POST http://localhost:3000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPass123!\"}"
```

### 用户登录
```powershell
curl -X POST http://localhost:3000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"password\":\"TestPass123!\"}"
```

## 🐛 故障排查

### 端口冲突
如果 3000 端口被占用，修改 `.docker-compose.env`:
```bash
PORT=3001
```

### 数据库连接失败
```powershell
# 检查数据库状态
deploy.bat logs postgres

# 重启服务
deploy.bat restart
```

### 查看详细日志
```powershell
# 查看所有服务日志
deploy.bat logs

# 查看特定服务日志
deploy.bat logs app
deploy.bat logs postgres
deploy.bat logs redis
```

## 📦 生产部署

### 使用 GitHub Actions 自动部署

1. 设置 GitHub Secrets:
   - `DEPLOY_HOST` - 服务器地址
   - `DEPLOY_USER` - SSH 用户名
   - `DEPLOY_SSH_KEY` - SSH 私钥

2. 创建版本标签:
```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions 会自动:
- 构建 Docker 镜像
- 推送到 GitHub Container Registry
- 部署到服务器

### 手动部署到服务器

```bash
# 1. 拉取代码
git clone https://github.com/your-org/nova-core.git
cd nova-core

# 2. 配置环境变量
cp .docker-compose.env.example .docker-compose.env
nano .docker-compose.env

# 3. 启动服务
deploy.bat prod
```

## 🔒 安全建议

1. **修改默认密码**: 编辑 `.docker-compose.env` 更改所有密码
2. **使用 HTTPS**: 配置 Nginx SSL 证书
3. **限制访问**: 配置防火墙规则
4. **定期备份**: 使用 `deploy.bat backup` 备份数据

## 📚 更多信息

- [完整部署文档](DEPLOYMENT.md)
- [API 文档](API.md)
- [GitHub 仓库](https://github.com/your-org/nova-core)
