#!/bin/bash
# 测试脚本

# 1. 发送验证码并提取 actualCode
echo "=== 1. 发送验证码 ==="
RESPONSE=$(curl -s -X POST http://localhost:3000/auth/sms/send \
  -H "Content-Type: application/json" \
  -d '{"phone":"18851772903","type":"login"}')
echo "$RESPONSE"
CODE=$(echo "$RESPONSE" | grep -o '"actualCode":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "提取的验证码: $CODE"
echo ""

# 2. 使用验证码登录
echo "=== 2. 使用验证码登录 ==="
curl -s -X POST http://localhost:3000/auth/sms/login \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"18851772903\",\"code\":\"$CODE\"}"
echo ""
echo ""

# 3. 测试注册（新用户）
echo "=== 3. 测试注册（新用户）==="
NEW_PHONE="18851772904"
NEW_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/sms/send \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$NEW_PHONE\",\"type\":\"register\"}")
echo "$NEW_RESPONSE"
NEW_CODE=$(echo "$NEW_RESPONSE" | grep -o '"actualCode":"[^"]*"' | cut -d'"' -f4)
echo "新用户验证码: $NEW_CODE"

curl -s -X POST http://localhost:3000/auth/sms/register \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"$NEW_PHONE\",\"code\":\"$NEW_CODE\",\"username\":\"testuser009\"}"
echo ""
