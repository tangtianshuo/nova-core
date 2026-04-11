# 测试 PostgreSQL 连接
$connectionString = "Host=localhost;Port=5432;Database=nova_core;Username=nova;Password=nova_password"

try {
    # 尝试使用 TCP 连接
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $tcpClient.Connect("localhost", 5432)
    Write-Host "✓ 端口 5432 可访问"
    $tcpClient.Close()

    # 测试 PostgreSQL 连接
    $env:PGPASSWORD = "nova_password"
    $result = & psql -h localhost -U nova -d nova_core -c "SELECT 'Connection OK' as test" 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL 连接成功"
        Write-Host $result
    } else {
        Write-Host "✗ PostgreSQL 连接失败"
        Write-Host $result
    }
} catch {
    Write-Host "✗ 连接错误: $_"
}
