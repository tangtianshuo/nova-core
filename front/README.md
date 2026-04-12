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

## Vercel 部署（CI/CD）

已提供 GitHub Actions 工作流与 Vercel 配置：

- Vercel 配置（SPA 重写，避免 `/auth` 直链 404）：[vercel.json](file:///d:/Projects/Nova/nova-core/front/vercel.json)
- GitHub Actions： [vercel-front.yml](file:///d:/Projects/Nova/nova-core/.github/workflows/vercel-front.yml)

需要在 GitHub 仓库 Settings → Secrets and variables → Actions 添加：

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

并在 Vercel 项目里配置环境变量（Production/Preview 各自配置）：

- `VITE_API_URL`：后端 API 地址，例如 `https://api.your-domain.com`
