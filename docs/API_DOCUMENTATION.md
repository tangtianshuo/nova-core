# API 文档维护指南

## 概述

Nova 认证中心的 API 文档通过 OpenAPI 3.0 规范维护，提供 Swagger UI 交互式文档。

## 文档位置

- **OpenAPI 规范**: `openapi.yaml`
- **Swagger UI**: `http://localhost:3000/api-docs` (仅开发环境)
- **API 快速参考**: `API.md`

## 访问 Swagger UI

```bash
# 启动开发服务器
npm run dev

# 访问文档
# 浏览器打开: http://localhost:3000/api-docs
```

## 文档更新流程

### 方法 1: 手动更新 openapi.yaml (推荐)

当修改 API 端点时，手动更新 `openapi.yaml` 对应的路径和方法。

**步骤**:
1. 修改代码中的路由处理函数
2. 同步更新 `openapi.yaml`:
   - 更新 `paths` 部分的对应端点
   - 更新 `components/schemas` 的数据模型
   - 更新 `components/responses` 的响应定义
3. 运行验证: `npm run docs:check`

### 方法 2: 使用 JSDoc 注释 (半自动)

在路由文件中添加 JSDoc 注释，然后运行同步工具。

**示例**:
```typescript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/LoginSuccess'
 */
router.post('/login', login);
```

运行同步:
```bash
npm run docs:sync
```

### 方法 3: 使用代码注释 (规划中)

在控制器方法上使用装饰器或注释自动生成文档（需要添加依赖）。

## 文档检查清单

在提交 API 修改前，确保:

- [ ] `openapi.yaml` 中的路径与实际路由一致
- [ ] 请求/响应 schema 与实际代码一致
- [ ] 错误响应 (`4xx`, `5xx`) 已完整描述
- [ ] 认证要求 (`security`) 已正确标注
- [ ] 参数验证规则已更新
- [ ] 示例值 (`example`) 是最新的
- [ ] 运行 `npm run docs:check` 无错误

## 常见修改场景

### 添加新端点

在 `openapi.yaml` 的 `paths` 部分添加:

```yaml
paths:
  /auth/new-endpoint:
    post:
      tags:
        - Authentication
      summary: 新端点描述
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                param1:
                  type: string
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NewResponse'
```

### 修改请求参数

1. 更新 `components/schemas` 中的对应 schema
2. 更新 `requestBody` 引用

### 添加新错误响应

在 `components/responses` 中添加:

```yaml
components:
  responses:
    NewError:
      description: 新错误类型
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: Error message here
```

### 添加新 OAuth 提供商

1. 在 `components/parameters/Provider` 的 enum 中添加
2. 在 OAuth 相关端点的描述中更新
3. 更新 `API.md` 中的示例

## 验证文档

```bash
# 验证 OpenAPI 规范
npm run docs:check

# 查看 Swagger UI
npm run dev
# 访问 http://localhost:3000/api-docs

# 测试 API 端点
# 在 Swagger UI 中点击 "Try it out" 按钮测试
```

## 发布到生产

生产环境不暴露 Swagger UI。确保:

```typescript
// src/app.ts
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', apiDocsRoutes);
}
```

## 文档版本管理

- OpenAPI 版本与 API 版本同步
- 重大变更时更新 `info.version`
- 维护变更日志 (`CHANGELOG.md`)

## 工具和资源

- **OpenAPI Generator**: 生成客户端 SDK
  ```bash
  npx openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o ./generated-sdk
  ```

- **Swagger Editor**: 在线编辑和验证
  https://editor.swagger.io/

- **Redoc**: 另一种文档渲染风格
  https://github.com/Redocly/redoc

## 自动化 Git 钩子 (可选)

使用 husky 在提交前检查文档:

```bash
npm install --save-dev husky
npx husky install
npx husky add .husky/pre-commit "tsx scripts/hooks/check-docs.ts"
```

## 故障排查

### Swagger UI 无法加载

- 检查 `openapi.yaml` 语法是否正确
- 检查端口是否被占用
- 确认开发环境变量 `NODE_ENV !== 'production'`

### 验证失败

- 使用在线工具验证: https://editor.swagger.io/
- 检查缩进是否正确 (YAML 对缩进敏感)
- 检查 `$ref` 引用是否存在

### 文档与实际不一致

- 运行 `npm run docs:sync` 同步
- 手动检查每个端点的实现
- 在 Swagger UI 中测试端点

## 贡献指南

提交 API 修改时请同时更新文档:

```bash
# 1. 修改代码
# 2. 更新 openapi.yaml
# 3. 验证文档
npm run docs:check
# 4. 提交
git add openapi.yaml src/modules/xxx.routes.ts
git commit -m "feat: add new endpoint and update docs"
```
