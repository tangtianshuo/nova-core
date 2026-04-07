<!-- GSD:project-start source:PROJECT.md -->
## Project

**用户登录与管理系统**

为现有的 C/S 客户端工程搭建一套基于 B/S 架构的用户登录认证系统，包含管理端后台和客户端对接服务。该系统作为独立的认证中心，管理用户登录、令牌验证和后台管理功能。

**Core Value:** 为客户端用户提供安全、可靠的身份认证服务，同时为管理员提供完善的后台管理能力。

### Constraints

- **技术约束**：服务端需提供 RESTful API 供客户端调用
- **安全约束**：密码需加密存储，令牌需有时效性
- **兼容性约束**：认证服务需易于对接现有客户端
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Backend Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Node.js** | 22.x | Runtime | 非阻塞I/O适合高并发认证请求，生态丰富，LTS版本稳定性好 |
| **Express.js** | 5.x | Web框架 | 轻量灵活，中间件生态成熟，适合认证这种IO密集型服务 |
| **TypeScript** | 5.x | 开发语言 | 类型安全提升代码质量，IDE支持好，降低维护成本 |
### Security & Authentication
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **jsonwebtoken** | 9.x | JWT生成/验证 | Node.js生态最成熟的JWT库，Google维护 |
| **bcrypt** | 6.x | 密码哈希 | 专为密码设计的哈希算法，内置salt，防彩虹表攻击 |
| **helmet** | 8.x | 安全头 | 自动设置CSP、HSTS等安全HTTP头 |
| **cors** | 2.x | 跨域控制 | 细粒度控制允许哪些域访问认证API |
| **express-rate-limit** | 8.x | 限流 | 防止暴力破解登录接口 |
### Database
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **PostgreSQL** | 16 | 主数据库 | ACID保证，JSON支持，成熟稳定， auth数据首选 |
| **Prisma** | 6.x | ORM | 类型安全的ORM，迁移方便，IDE支持好 |
| **Redis** | 7.x | Token缓存/黑名单 | JWT黑名单存储，refresh token存储，会话缓存 |
### Admin Panel (管理端后台)
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **React** | 19.x | 前端框架 | 生态最完整，组件库丰富 |
| **Ant Design** | 5.x | UI组件库 | 企业级UI，开箱即用，减少开发时间 |
| **Vite** | 6.x | 构建工具 | 开发体验好，热更新快 |
### Infrastructure
| Technology | Purpose | Why |
|------------|---------|-----|
| **Docker** | 容器化 | 认证服务作为独立中心，容器化便于部署和扩展 |
| **JWT Access Token** | 短期访问令牌 | 15分钟-1小时有效期，被截获风险低 |
| **JWT Refresh Token** | 长期刷新令牌 | 7-30天，存储在httpOnly cookie或数据库 |
## 技术选型理由详解
### 为什么选择 JWT 而不是 Session？
| 维度 | JWT | Session |
|------|-----|---------|
| 扩展性 | 无状态，分布式友好 | 需要Redis等外部存储 |
| 客户端支持 | C/S客户端原生支持 | 需要客户端配合cookie |
| 注销控制 | 需要黑名单机制 | 服务端直接删除 |
| 适用场景 | 认证中心多客户端 | 单体应用 |
### 为什么密码存储用 bcrypt 而不是 MD5/SHA？
- MD5/SHA 是哈希算法，设计目标是快速，GPU可以每秒数十亿次计算
- bcrypt 是专门为密码设计的，内置cost factor，可以调整计算时间
- 相同密码每次哈希结果不同（内置salt）
### 为什么需要 Redis？
## 项目结构建议
## 安装命令 (已验证版本)
# 核心依赖 - 2026-04-06 npm验证
# ORM - npm验证 Prisma 6.x
# 数据库
# 管理后台 - npm验证版本
## 版本验证记录 (2026-04-06)
| 包名 | 文档推荐版本 | npm验证版本 |
|------|-------------|-------------|
| express | 5.x | 5.2.1 |
| jsonwebtoken | 9.x | 9.0.3 |
| bcrypt | 6.x | 6.0.0 |
| helmet | 8.x | 8.1.0 |
| express-rate-limit | 8.x | 8.3.2 |
| cors | 2.x | 2.8.6 |
| prisma | 6.x | 6.x (最新6.x) |
| typescript | 5.x | 5.x |
| react | 19.x | 19.2.4 |
| vite | 6.x | 6.x |
| antd | 5.x | 5.x |
## 参考来源
- [Express.js Documentation](https://expressjs.com/) - Web框架
- [JWT.io](https://jwt.io/) - JWT标准
- [bcrypt Wikipedia](https://en.wikipedia.org/wiki/Bcrypt) - 密码哈希算法
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - 认证安全最佳实践
- [Prisma Documentation](https://prisma.io/docs) - ORM
- [Ant Design React](https://ant.design/) - UI组件库
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
