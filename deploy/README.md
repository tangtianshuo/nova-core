# Deploy 部署文件目录

本目录包含项目部署相关的所有配置文件和脚本。

## 目录结构

```
deploy/
├── Dockerfile           # Docker 镜像构建文件
├── docker-compose.yml   # 生产环境 Docker Compose 配置
├── docker-compose.dev.yml  # 开发环境 Docker Compose 配置
├── docker-deploy.sh    # Docker 部署脚本
├── deploy.sh           # Linux/macOS 部署脚本
├── deploy.bat         # Windows 部署脚本
├── nginx/              # Nginx 配置目录
│   ├── nginx.conf     # Nginx 配置文件
│   ├── logs/          # 日志目录
│   └── ssl/           # SSL 证书目录
├── DEPLOYMENT.md      # 部署详细文档
├── DEPLOY_WINDOWS.md  # Windows 部署指南
├── DEPLOY_REPORT.md   # 部署报告
├── DEPLOY_STATUS.md   # 部署状态
└── QUICKSTART.md     # 快速开始指南
```

## 快速部署

### Docker 部署（推荐）

```bash
# 1. 复制环境变量文件
cp .env.example .env
# 编辑 .env 配置数据库和 JWT 密钥

# 2. 启动服务
docker-compose -f deploy/docker-compose.yml up -d

# 3. 查看日志
docker-compose -f deploy/docker-compose.yml logs -f
```

### Linux/macOS 部署

```bash
bash deploy/deploy.sh
```

### Windows 部署

```cmd
deploy\deploy.bat
```

## Docker Compose 配置说明

| 文件 | 用途 |
|------|------|
| `docker-compose.yml` | 生产环境，包含 App + Redis + PostgreSQL |
| `docker-compose.dev.yml` | 开发环境，使用内存数据库 |

## Nginx 配置

生产环境建议使用 Nginx 作为反向代理：

```bash
cp deploy/nginx/nginx.conf /etc/nginx/conf.d/nova.conf
nginx -t
systemctl reload nginx
```

## 环境变量

部署前需要配置以下环境变量：

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/nova_core
JWT_SECRET=your-secret-key-min-32-chars
ALIYUN_SMS_ACCESS_KEY_ID=your-access-key
ALIYUN_SMS_ACCESS_KEY_SECRET=your-secret-key
ALIYUN_SMS_SIGN_NAME=您的签名
ALIYUN_SMS_TEMPLATE_CODE=SMS_xxxxx
```

详细配置说明请参考 `DEPLOYMENT.md`。
