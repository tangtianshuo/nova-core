#!/bin/bash

# Nova Core Docker 部署脚本
# 使用方法: ./docker-deploy.sh [command]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
}

# 检查环境配置文件
check_env() {
    if [ ! -f ".docker-compose.env" ]; then
        print_warn "未找到 .docker-compose.env 文件"
        print_info "从示例文件创建配置..."
        cp .docker-compose.env.example .docker-compose.env
        print_warn "请编辑 .docker-compose.env 文件并设置必要的环境变量"
        print_info "编辑完成后重新运行此脚本"
        exit 0
    fi
}

# 启动服务
start_services() {
    print_info "启动 Nova Core 服务..."
    docker-compose up -d
    print_info "服务启动完成"
    print_info "查看日志: docker-compose logs -f"
    print_info "健康检查: curl http://localhost:3000/health"
}

# 停止服务
stop_services() {
    print_info "停止 Nova Core 服务..."
    docker-compose down
    print_info "服务已停止"
}

# 重启服务
restart_services() {
    print_info "重启 Nova Core 服务..."
    docker-compose restart
    print_info "服务已重启"
}

# 查看日志
view_logs() {
    SERVICE=${1:-app}
    print_info "查看 $SERVICE 服务日志..."
    docker-compose logs -f "$SERVICE"
}

# 运行数据库迁移
run_migration() {
    print_info "运行数据库迁移..."
    docker-compose exec app npx prisma migrate deploy
    print_info "迁移完成"
}

# 创建管理员用户
create_admin() {
    print_info "创建管理员用户..."
    docker-compose exec app npm run create-user
}

# 更新服务
update_services() {
    print_info "更新 Nova Core 服务..."

    # 拉取最新代码
    print_info "拉取最新代码..."
    git pull

    # 拉取新镜像
    print_info "拉取新镜像..."
    docker-compose pull

    # 重启服务
    print_info "重启服务..."
    docker-compose up -d

    # 运行迁移
    print_info "运行数据库迁移..."
    docker-compose exec app npx prisma migrate deploy

    print_info "更新完成"
}

# 备份数据库
backup_database() {
    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"

    BACKUP_FILE="$BACKUP_DIR/nova_core_$(date +%Y%m%d_%H%M%S).sql"

    print_info "备份数据库到 $BACKUP_FILE..."
    docker-compose exec -T postgres pg_dump -U nova nova_core > "$BACKUP_FILE"

    print_info "备份完成: $BACKUP_FILE"
}

# 显示状态
show_status() {
    print_info "服务状态:"
    docker-compose ps

    echo ""
    print_info "资源使用:"
    docker stats --no-stream $(docker-compose ps -q)
}

# 健康检查
health_check() {
    print_info "执行健康检查..."

    # 检查容器状态
    if ! docker-compose ps | grep -q "Up"; then
        print_error "服务未运行"
        exit 1
    fi

    # 检查 API 健康端点
    if curl -sf http://localhost:3000/health > /dev/null; then
        print_info "API 健康检查: ✓ 通过"
    else
        print_error "API 健康检查: ✗ 失败"
        exit 1
    fi

    # 检查数据库连接
    if docker-compose exec postgres pg_isready -U nova > /dev/null 2>&1; then
        print_info "数据库连接: ✓ 正常"
    else
        print_error "数据库连接: ✗ 失败"
        exit 1
    fi

    # 检查 Redis 连接
    if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
        print_info "Redis 连接: ✓ 正常"
    else
        print_error "Redis 连接: ✗ 失败"
        exit 1
    fi

    print_info "所有健康检查通过 ✓"
}

# 清理资源
cleanup() {
    print_warn "清理未使用的 Docker 资源..."
    docker system prune -f
    print_info "清理完成"
}

# 显示帮助
show_help() {
    cat << EOF
Nova Core Docker 部署脚本

使用方法:
    ./docker-deploy.sh [command]

命令:
    start       启动服务
    stop        停止服务
    restart     重启服务
    logs [srv]  查看日志 (默认: app)
    status      显示服务状态
    health      执行健康检查
    migrate     运行数据库迁移
    admin       创建管理员用户
    update      更新服务
    backup      备份数据库
    cleanup     清理未使用的 Docker 资源
    help        显示此帮助信息

示例:
    ./docker-deploy.sh start
    ./docker-deploy.sh logs postgres
    ./docker-deploy.sh health

EOF
}

# 主函数
main() {
    check_docker

    case "${1:-help}" in
        start)
            check_env
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            view_logs "$2"
            ;;
        status)
            show_status
            ;;
        health)
            health_check
            ;;
        migrate)
            run_migration
            ;;
        admin)
            create_admin
            ;;
        update)
            update_services
            ;;
        backup)
            backup_database
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

main "$@"
