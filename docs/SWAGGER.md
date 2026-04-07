# Swagger 文档维护指南

## 概述

本项目的 API 文档使用 OpenAPI 3.0 规范，文档文件为 `openapi.yaml`。开发过程中需要保持代码与文档的同步更新。

## 访问文档

- **开发环境**: http://localhost:3000/api-docs
- **文档源文件**: `/openapi.yaml`
- **JSON 格式**: http://localhost:3000/api-docs/swagger.json
- **YAML 格式**: http://localhost:3000/api-docs/swagger.yaml

## 文档同步原则

### 何时更新文档

**必须更新**的情况：
- 新增 API 端点
- 修改请求/响应结构
- 修改参数要求（required/optional）
- 修改认证要求
- 修改错误码或错误响应

**建议更新**的情况：
- 修改示例值
- 优化描述文字
- 添加新的枚举值

### 更新流程

1. **修改代码**：实现或修改 API 功能
2. **更新文档**：同步修改 `openapi.yaml`
3. **验证文档**：运行验证脚本确保文档有效
4. **测试文档**：访问 Swagger UI 确认显示正确
5. **提交变更**：将代码和文档一起提交

## 文档结构

### 基本信息（info）
- title: API 名称
- description: 详细描述和认证说明
- version: 语义化版本号
- contact: 联系方式

### 服务器配置（servers）
定义不同环境的服务器地址。

### 标签（tags）
用于分组 API 端点，便于导航。

### 路径（paths）
定义所有 API 端点及其方法。

### 组件（components）
- **securitySchemes**: 认证方式定义
- **parameters**: 可复用参数
- **schemas**: 数据模型定义
- **responses**: 可复用响应定义

## 编写规范

### 端点定义

```yaml
paths:
  /auth/login:
    post:
      tags:
        - Authentication
      summary: 简短摘要（一行）
      description: 详细描述（可多行，可包含 Markdown）
      operationId: login（唯一操作 ID，用于代码生成）
      security:
        - BearerAuth: []（如需认证）
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
            examples:
              example_name:
                summary: 示例说明
                value: { ... }
      responses:
        '200':
          description: 成功响应说明
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
```

### Schema 定义

```yaml
components:
  schemas:
    LoginRequest:
      type: object
      required:
        - username
        - password
      properties:
        username:
          type: string
          description: 用户名或邮箱
          example: user@example.com
          minLength: 1
          maxLength: 100
        password:
          type: string
          format: password
          description: 密码
          example: password123
```

### 复用组件

优先使用 `$ref` 引用已定义的组件：

```yaml
# 引用参数
- $ref: '#/components/parameters/Provider'

# 引用 Schema
schema:
  $ref: '#/components/schemas/Error'

# 引用响应
$ref: '#/components/responses/Unauthorized'
```

## 验证工具

### 安装 Swagger 验证工具

```bash
npm install -D @apidevtools/swagger-cli
```

### 验证文档

```bash
# 验证 openapi.yaml 语法
npx swagger-cli validate openapi.yaml

# 格式化文档（可选）
npx swagger-cli bundle openapi.yaml -o openapi-bundled.yaml --type yaml
```

## 开发工作流

### 新增 API 端点

1. 在 controller 中实现端点
2. 在 types.ts 中定义类型
3. 在 `openapi.yaml` 中添加端点定义
4. 在 Swagger UI 中测试端点
5. 提交代码和文档

### 修改现有 API

1. 修改 controller 逻辑
2. 更新 types.ts 类型定义
3. 更新 `openapi.yaml` 中的相关定义
4. 验证向后兼容性（如可能破坏现有客户端，需要升级版本号）
5. 在 Swagger UI 中测试
6. 提交代码和文档

### 版本控制

- **主版本**: 不兼容的 API 变更
- **次版本**: 向后兼容的功能新增
- **修订号**: 向后兼容的问题修复

当有破坏性变更时：
1. 更新 `info.version` 版本号
2. 在描述中标注废弃或变更说明
3. 保留旧端点一段时间（标记为 deprecated）

## 常见问题

### Q: 文档和代码不一致怎么办？

使用验证工具检查文档语法，然后对照 controller 代码逐一检查：
- 路径是否正确
- 方法是否匹配
- 参数是否完整
- 响应是否准确

### Q: 如何处理认证端点？

在 `security` 部分引用已定义的认证方案：

```yaml
security:
  - BearerAuth: []
```

对于不需要认证的端点，可以省略此字段或使用空对象：

```yaml
security: []
```

### Q: 如何添加文件上传？

使用 multipart/form-data：

```yaml
requestBody:
  required: true
  content:
    multipart/form-data:
      schema:
        type: object
        properties:
          file:
            type: string
            format: binary
```

### Q: 如何处理分页？

添加统一的分页参数：

```yaml
parameters:
  - name: page
    in: query
    schema:
      type: integer
      default: 1
  - name: limit
    in: query
    schema:
      type: integer
      default: 10
      maximum: 100
```

## 最佳实践

1. **保持简洁**: 避免过度详细的示例
2. **使用示例**: 为复杂请求/响应添加示例
3. **复用组件**: 使用 `$ref` 避免重复
4. **版本控制**: 重大变更时更新版本号
5. **验证文档**: 每次修改后运行验证
6. **测试端点**: 在 Swagger UI 中手动测试
7. **描述清晰**: 使用简洁明了的语言
8. **错误处理**: 记录所有可能的错误响应

## 相关资源

- [OpenAPI 3.0 规范](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/)
- [OpenAPI 最佳实践](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#best-practices)
