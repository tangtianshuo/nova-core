# Front

Nova Core 的前端页面：

- `/`：产品介绍与下载页（参考 `nova-agents-landing.html` 设计稿）
- `/auth`：认证演示页（用于验证 Nova Auth SDK 与后端登录能力）

## 快速开始

```bash
npm install
npm run dev
```

访问：

- `http://localhost:5173`（产品介绍与下载）
- `http://localhost:5173/auth`（认证演示）

## 环境变量

在 `front` 目录创建 `.env`（可选）：

```bash
VITE_API_URL=http://localhost:3000
```
