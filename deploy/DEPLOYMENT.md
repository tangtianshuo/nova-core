# Nova Core 部署指南

本文档介绍如何使用 Docker 和 GitHub Actions 部署 Nova Core 认证服务。

## 目录

- [快速开始](#快速开始)
- [Docker 本地部署](#docker-本地部署)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [生产环境配置](#生产环境配置)
- [更新部署](#更新部署)

## 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- Git

### 一键启动

```bash
# 克隆仓库
git clone https://github.com/your-org/nova-core.git
cd nova-core

# 复制环境配置文件
cp .docker-compose.env.example .docker-compose.env

# 编辑配置文件，设置必要的环境变量
nano .docker-compose.env

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f app

# 运行数据库迁移
docker-compose exec app npx prisma migrate deploy
```

服务将在 http://localhost:3000 启动。

## Docker 本地部署

### 环境变量配置

创建 `.docker-compose.env` 文件并配置以下变量：

```bash
# 应用配置
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production

# PostgreSQL 配置
POSTGRES_USER=nova
POSTGRES_PASSWORD=nova_password_change_in_production
POSTGRES_DB=nova_core

# Redis 配置
REDIS_PASSWORD=redis_password_change_in_production

# 阿里云短信（可选）
ALIYUN_SMS_ACCESS_KEY_ID=your_access_key
ALIYUN_SMS_ACCESS_KEY_SECRET=your_secret
ALIYUN_SMS_SIGN_NAME=your_sign_name
```

### 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 停止服务
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

### 数据库迁移

```bash
# 生成迁移文件（开发环境）
docker-compose exec app npx prisma migrate dev --name init

# 应用迁移（生产环境）
docker-compose exec app npx prisma migrate deploy

# 查看迁移状态
docker-compose exec app npx prisma migrate status
```

### 创建管理员用户

```bash
docker-compose exec app npm run create-user
```

## GitHub Actions CI/CD

### 配置 GitHub Secrets

在 GitHub 仓库中设置以下 Secrets：

| Secret 名称 | 描述 | 示例 |
|------------|------|------|
| `GITHUB_TOKEN` | GitHub 自动提供，无需配置 | - |
| `DEPLOY_HOST` | 部署服务器地址 | your-server.com |
| `DEPLOY_USER` | 部署服务器用户名 | deploy |
| `DEPLOY_SSH_KEY` | SSH 私钥 | -----BEGIN RSA... |
| `DEPLOY_PORT` | SSH 端口（可选） | 22 |

### 生成 SSH 密钥

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# 将公钥复制到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server.com

# 将私钥添加到 GitHub Secrets
cat ~/.ssh/github_actions
```

### 服务器准备

在目标服务器上：

```bash
# 安装 Docker 和 Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 创建项目目录
mkdir -p /opt/nova-core
cd /opt/nova-core

# 克隆仓库
git clone https://github.com/your-org/nova-core.git .

# 复制环境配置
cp .docker-compose.env.example .docker-compose.env
nano .docker-compose.env

# 配置 docker-compose.yml 使用远程镜像
sed -i 's|build:|image: ghcr.io/your-org/nova-core:latest|' docker-compose.yml
```

### 触发部署

创建并推送 Git Tag 来触发部署：

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签（自动触发 CI/CD）
git push origin v1.0.0
```

GitHub Actions 将自动：
1. 构建 Docker 镜像
2. 推送到 GitHub Container Registry
3. 连接到服务器
4. 拉取新镜像
5. 重启服务

## 生产环境配置

### 使用 Nginx 反向代理

```bash
# 启用 Nginx 配置
docker-compose --profile with-nginx up -d
```

### SSL 证书

```bash
# 使用 Let's Encrypt 获取免费证书
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/CN=your-domain.com"
```

### 防火墙配置

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# firewalld (CentOS)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  app:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 更新部署

### 手动更新

```bash
# 拉取最新代码
git pull

# 拉取新镜像
docker-compose pull

# 重启服务
docker-compose up -d

# 运行迁移
docker-compose exec app npx prisma migrate deploy
```

### 使用 Tag 自动更新

```bash
# 创建新版本
git tag v1.1.0
git push origin v1.1.0

# GitHub Actions 自动完成部署
```

## 监控与维护

### 查看日志

```bash
# 应用日志
docker-compose logs -f app

# 数据库日志
docker-compose logs -f postgres

# Redis 日志
docker-compose logs -f redis
```

### 健康检查

```bash
# 检查服务健康状态
curl http://localhost:3000/health

# 检查容器状态
docker-compose ps
```

### 备份数据

```bash
# 备份数据库
docker-compose exec postgres pg_dump -U nova nova_core > backup_$(date +%Y%m%d).sql

# 备份到卷
docker run --rm \
  -v nova-core_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup_$(date +%Y%m%d).tar.gz -C /data .
```

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs app

# 检查配置
docker-compose config

# 进入容器调试
docker-compose exec app sh
```

### 数据库连接失败

```bash
# 检查数据库状态
docker-compose exec postgres pg_isready -U nova

# 查看数据库日志
docker-compose logs postgres
```

### Redis 连接失败

```bash
# 检查 Redis 状态
docker-compose exec redis redis-cli ping

# 查看 Redis 日志
docker-compose logs redis
```

## 安全建议

1. **修改默认密码**：更改所有默认密码和密钥
2. **限制网络访问**：只开放必要的端口
3. **使用 HTTPS**：生产环境必须使用 SSL/TLS
4. **定期更新**：及时更新 Docker 镜像和依赖
5. **备份策略**：制定定期备份计划
6. **监控告警**：配置日志监控和告警

## 参考资料

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Prisma 部署指南](https://www.prisma.io/docs/guides/deployment)
