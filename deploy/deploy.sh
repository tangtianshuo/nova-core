#!/bin/bash
# Nova Core 部署脚本 (Git Bash / WSL)

DOCKER="/c/Program Files/Docker/Docker/resources/bin/docker.exe"
COMPOSE="$DOCKER compose"

case "${1:-help}" in
  build)
    echo "========================================"
    echo "构建 Docker 镜像..."
    echo "========================================"
    $COMPOSE build
    ;;
  dev)
    echo "========================================"
    echo "启动开发环境..."
    echo "========================================"
    $COMPOSE -f docker-compose.yml -f docker-compose.dev.yml up -d app-dev
    echo ""
    echo "开发环境已启动！"
    echo "API 地址: http://localhost:3000"
    echo "API 文档: http://localhost:3000/api-docs"
    ;;
  prod|start)
    echo "========================================"
    echo "启动生产环境..."
    echo "========================================"
    $COMPOSE up -d
    echo ""
    echo "生产环境已启动！"
    echo "API 地址: http://localhost:3000"
    ;;
  stop)
    echo "========================================"
    echo "停止所有服务..."
    echo "========================================"
    $COMPOSE down
    echo "服务已停止！"
    ;;
  restart)
    echo "========================================"
    echo "重启服务..."
    echo "========================================"
    $COMPOSE restart
    echo "服务已重启！"
    ;;
  logs)
    $COMPOSE logs -f "${2:-}"
    ;;
  status)
    echo "========================================"
    echo "服务状态"
    echo "========================================"
    $COMPOSE ps
    ;;
  health)
    echo "========================================"
    echo "健康检查"
    echo "========================================"
    echo ""
    echo "检查应用服务..."
    if curl -s http://localhost:3000/health > /dev/null; then
      echo "✓ 应用服务正常"
    else
      echo "✗ 应用服务异常"
    fi
    echo ""
    echo "检查数据库..."
    if $DOCKER exec nova-core-postgres pg_isready -U nova > /dev/null 2>&1; then
      echo "✓ 数据库连接正常"
    else
      echo "✗ 数据库连接异常"
    fi
    echo ""
    echo "检查 Redis..."
    if $DOCKER exec nova-core-redis redis-cli ping > /dev/null 2>&1; then
      echo "✓ Redis 连接正常"
    else
      echo "✗ Redis 连接异常"
    fi
    ;;
  *)
    echo "========================================"
    echo "Nova Core 部署脚本"
    echo "========================================"
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh [command]"
    echo ""
    echo "可用命令:"
    echo "  build       构建 Docker 镜像"
    echo "  dev         启动开发环境"
    echo "  prod        启动生产环境"
    echo "  start       启动服务"
    echo "  stop        停止服务"
    echo "  restart     重启服务"
    echo "  logs [srv]  查看日志"
    echo "  status      显示服务状态"
    echo "  health      执行健康检查"
    echo ""
    exit 0
    ;;
esac
