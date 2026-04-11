@echo off
REM Nova Core 部署脚本
REM 使用方法: deploy.bat [command]

setlocal EnableDelayedExpansion

set DOCKER="C:\Program Files\Docker\Docker\resources\bin\docker.exe"
set COMPOSE=%DOCKER% compose

:parse_args
if "%1"=="" goto main
if /i "%1"=="start" goto start
if /i "%1"=="stop" goto stop
if /i "%1"=="restart" goto restart
if /i "%1"=="logs" goto logs
if /i "%1"=="status" goto status
if /i "%1"=="health" goto health
if /i "%1"=="build" goto build
if /i "%1"=="prod" goto prod
if /i "%1"=="dev" goto dev
if /i "%1"=="help" goto help
goto help

:main
call :help
exit /b 0

:build
echo ========================================
echo 构建 Docker 镜像...
echo ========================================
%COMPOSE% build
if %errorlevel% neq 0 (
    echo 构建失败！
    exit /b 1
)
echo 构建完成！
exit /b 0

:dev
echo ========================================
echo 启动开发环境...
echo ========================================
%COMPOSE% -f docker-compose.yml -f docker-compose.dev.yml up -d app-dev
if %errorlevel% neq 0 (
    echo 启动失败！
    exit /b 1
)
echo.
echo 开发环境已启动！
echo API 地址: http://localhost:3000
echo API 文档: http://localhost:3000/api-docs
echo.
echo 查看日志: deploy.bat logs
echo 停止服务: deploy.bat stop
exit /b 0

:prod
echo ========================================
echo 启动生产环境...
echo ========================================
%COMPOSE% up -d
if %errorlevel% neq 0 (
    echo 启动失败！
    exit /b 1
)
echo.
echo 生产环境已启动！
echo API 地址: http://localhost:3000
echo.
echo 查看日志: deploy.bat logs
echo 停止服务: deploy.bat stop
exit /b 0

:start
call :prod
exit /b 0

:stop
echo ========================================
echo 停止所有服务...
echo ========================================
%COMPOSE% down
echo 服务已停止！
exit /b 0

:restart
echo ========================================
echo 重启服务...
echo ========================================
%COMPOSE% restart
echo 服务已重启！
exit /b 0

:logs
if "%2"=="" (
    %COMPOSE% logs -f
) else (
    %COMPOSE% logs -f %2
)
exit /b 0

:status
echo ========================================
echo 服务状态
echo ========================================
%COMPOSE% ps
exit /b 0

:health
echo ========================================
echo 健康检查
echo ========================================
echo.
echo 检查应用服务...
curl -s http://localhost:3000/health
if %errorlevel% equ 0 (
    echo.
    echo ✓ 应用服务正常
) else (
    echo.
    echo ✗ 应用服务异常
)
echo.
echo 检查数据库...
%DOCKER% exec nova-core-postgres pg_isready -U nova >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ 数据库连接正常
) else (
    echo ✗ 数据库连接异常
)
echo.
echo 检查 Redis...
%DOCKER% exec nova-core-redis redis-cli ping >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Redis 连接正常
) else (
    echo ✗ Redis 连接异常
)
exit /b 0

:help
echo ========================================
echo Nova Core 部署脚本
echo ========================================
echo.
echo 使用方法:
echo     deploy.bat [command]
echo.
echo 可用命令:
echo     build       构建 Docker 镜像
echo     dev         启动开发环境
echo     prod        启动生产环境（默认）
echo     start       启动服务（同 prod）
echo     stop        停止服务
echo     restart     重启服务
echo     logs [srv]  查看日志（可选指定服务）
echo     status      显示服务状态
echo     health      执行健康检查
echo     help        显示此帮助信息
echo.
echo 示例:
echo     deploy.bat build       先构建镜像
echo     deploy.bat dev         启动开发环境
echo     deploy.bat logs app    查看应用日志
echo     deploy.bat health      健康检查
echo.
exit /b 0
