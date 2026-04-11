# Tests 测试文件目录

本目录包含项目开发过程中使用的测试脚本和工具。

## 文件说明

| 文件 | 说明 |
|------|------|
| `test-auth-flow.ts` | 登录/注册完整闭环测试 |
| `test-sms-direct.ts` | 短信 SDK 直接测试 |
| `test-sms-flow.ts` | 短信验证码流程测试 |
| `test-login-flow.sh` | 登录流程 Shell 脚本测试 |
| `test-config.ts` | 配置加载测试 |
| `test-sdk.cjs` | 阿里云 SDK CommonJS 测试 |
| `test-db.js` | 数据库连接测试 |
| `test-db-connection.ps1` | 数据库连接 PowerShell 测试 |
| `TESTING.md` | 测试文档 |

## 运行测试

### 使用 TypeScript 直接运行
```bash
# 短信 SDK 测试
npx tsx --env-file=.env tests/test-sms-direct.ts

# 登录闭环测试
npx tsx --env-file=.env tests/test-auth-flow.ts
```

### 使用 Shell 脚本
```bash
bash tests/test-login-flow.sh
```

### 使用 PowerShell
```powershell
pwsh tests/test-db-connection.ps1
```

## 注意事项

- 测试文件使用 `.env` 文件中的配置
- 部分测试需要真实的阿里云短信服务凭证
- 开发模式下（未配置凭证）会使用 Mock 模式
