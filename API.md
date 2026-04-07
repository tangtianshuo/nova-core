# Nova API 文档

## REST API 认证服务

Nova 认证中心提供标准的 RESTful API，支持所有编程语言。

## 快速开始

### 基础 URL

```
生产环境: https://api.nova.com
开发环境: http://localhost:3000
```

### 认证方式

所有 API 请求需要在 Header 中携带 JWT token：

```http
Authorization: Bearer <your_access_token>
```

## API 端点

### 1. 用户注册

**请求**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**响应**
```json
{
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "message": "注册成功",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "1h"
}
```

### 2. 用户登录

**请求**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john@example.com",
  "password": "password123"
}
```

**响应**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "1h"
}
```

### 3. 刷新令牌

**请求**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "1h"
}
```

### 4. 验证令牌

**请求**
```http
POST /auth/validate
Authorization: Bearer <access_token>
```

**响应**
```json
{
  "valid": true,
  "user": {
    "userId": "user_123",
    "username": "johndoe"
  }
}
```

### 5. 用户注销

**请求**
```http
POST /auth/logout
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应**
```json
{
  "message": "Logged out successfully"
}
```

## OAuth 2.0 集成

### GitHub 登录

**步骤 1: 获取授权 URL**

```http
GET /auth/oauth/github/login
```

**响应**: 重定向到 GitHub 授权页面

**步骤 2: 处理回调**

用户授权后，GitHub 会重定向到：

```
https://your-app.com/login/oauth/callback?code=xxx&state=yyy
```

**步骤 3: 获取令牌**

回调 URL 会包含 access_token 和 refresh_token：

```
https://your-app.com/login/oauth/callback?access_token=xxx&refresh_token=yyy&user_id=zzz&username=www
```

## 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权或令牌无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 多语言示例

### cURL

```bash
# 登录
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'
```

### Python

```python
import requests

# 登录
response = requests.post('http://localhost:3000/auth/login', json={
    'username': 'user@example.com',
    'password': 'password123'
})
data = response.json()
access_token = data['accessToken']

# 验证令牌
headers = {'Authorization': f'Bearer {access_token}'}
response = requests.post('http://localhost:3000/auth/validate', headers=headers)
```

### Java (OkHttp)

```java
OkHttpClient client = new OkHttpClient();

// 登录
String json = "{\"username\":\"user@example.com\",\"password\":\"password123\"}";
RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));
Request request = new Request.Builder()
    .url("http://localhost:3000/auth/login")
    .post(body)
    .build();

Response response = client.newCall(request).execute();
```

### C# (HttpClient)

```csharp
using var client = new HttpClient();

// 登录
var payload = new {
    username = "user@example.com",
    password = "password123"
};
var json = JsonSerializer.Serialize(payload);
var content = new StringContent(json, Encoding.UTF8, "application/json");

var response = await client.PostAsync("http://localhost:3000/auth/login", content);
var data = await response.Content.ReadAsStringAsync();
```

### Go

```go
// 登录
payload := map[string]string{
    "username": "user@example.com",
    "password": "password123",
}
jsonData, _ := json.Marshal(payload)

resp, err := http.Post(
    "http://localhost:3000/auth/login",
    "application/json",
    bytes.NewBuffer(jsonData),
)
```

## 使用 SDK（可选）

如果你使用 TypeScript/JavaScript，可以使用官方 SDK 简化集成：

```bash
npm install @nova-core/auth-sdk
```

详见 [SDK 文档](https://github.com/your-org/nova-core/tree/main/nova-auth-sdk)

## 支持

- API 文档: https://docs.nova.com
- GitHub: https://github.com/your-org/nova-core
