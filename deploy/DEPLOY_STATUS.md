# Nova Core 部署状态

## 📊 当前状态

| 组件 | 状态 | 说明 |
|------|------|------|
| PostgreSQL | ✅ 运行中 | 端口 5432, 数据库已初始化 |
| Redis | ✅ 运行中 | 端口 6379 |
| 应用服务 | ⏳ 构建中 | Docker 镜像正在构建 |

## 🚀 快速命令

```bash
# 检查构建进度
docker-compose logs -f build

# 启动应用（构建完成后）
docker-compose up -d app

# 查看所有服务状态
docker-compose ps

# 查看应用日志
docker-compose logs -f app
```

## 🔗 部署完成后访问

- **API 服务**: http://localhost:3000
- **健康检查**: http://localhost:3000/health
- **API 文档**: http://localhost:3000/api-docs

## 📝 配置文件

- `.docker-compose.env` - 环境变量配置
- `docker-compose.yml` - 服务编排配置
- `Dockerfile` - 应用镜像构建配置
- `.dockerignore` - 构建排除文件

## 🐛 故障排查

如果构建失败，检查：

1. Docker Desktop 是否运行
2. 磁盘空间是否充足（需要约 2GB）
3. 网络连接是否正常

```bash
# 查看 Docker 状态
docker info

# 查看磁盘使用
docker system df

# 清理未使用的资源
docker system prune -a
```

## 📚 相关文档

- `QUICKSTART.md` - 快速入门指南
- `DEPLOYMENT.md` - 完整部署文档
- `deploy.bat` - Windows 部署脚本
- `deploy.sh` - Linux/Mac 部署脚本
