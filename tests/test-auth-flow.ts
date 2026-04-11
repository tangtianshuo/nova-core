/**
 * 直接测试登录/注册闭环
 * 通过直接操作 Redis 和数据库来模拟完整流程
 */

import { storeSmsCode, getSmsCode, verifySmsCode, deleteSmsCode } from './src/modules/sms/sms.service.js';
import prisma from './src/lib/prisma.js';
import { generateAccessToken, createRefreshToken } from './src/modules/auth/auth.service.js';
import { config } from './src/config/index.js';

const TEST_PHONE = '18851772903';

async function testLoginFlow() {
  console.log('=== 测试手机号登录闭环 ===\n');

  // 1. 直接在 Redis 中存储验证码（模拟用户收到验证码后的场景）
  const code = '888888';
  console.log(`1. 模拟验证码: ${code}`);
  await storeSmsCode(TEST_PHONE, code, 'login');
  console.log('   验证码已存储到 Redis\n');

  // 2. 获取验证码验证
  const storedCode = await getSmsCode(TEST_PHONE, 'login');
  console.log(`2. Redis 中存储的验证码: ${storedCode}\n`);

  // 3. 验证验证码
  const isValid = await verifySmsCode(TEST_PHONE, code, 'login');
  console.log(`3. 验证码验证结果: ${isValid}\n`);

  // 4. 查找用户
  const user = await prisma.user.findUnique({ where: { phone: TEST_PHONE } });
  console.log(`4. 查找用户: ${user ? '找到' : '未找到'}`);
  if (user) {
    console.log(`   用户名: ${user.username}`);
    console.log(`   用户ID: ${user.id}\n`);

    // 5. 生成 token
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = await createRefreshToken(user.id);
    console.log('5. 生成 Token:');
    console.log(`   accessToken: ${accessToken.substring(0, 50)}...`);
    console.log(`   refreshToken: ${refreshToken.substring(0, 50)}...`);
    console.log(`   expiresIn: ${config.jwt.accessToken.expiresIn}\n`);
  }

  console.log('=== 登录闭环测试完成 ===');
}

async function testRegisterFlow() {
  console.log('\n=== 测试手机号注册闭环 ===\n');

  const newPhone = '13900000099';
  const newCode = '666666';
  const newUsername = 'testuser_' + Date.now().toString().slice(-6);

  // 1. 存储验证码
  console.log(`1. 模拟验证码: ${newCode}`);
  await storeSmsCode(newPhone, newCode, 'register');

  // 2. 验证验证码
  const isValid = await verifySmsCode(newPhone, newCode, 'register');
  console.log(`2. 验证码验证结果: ${isValid}\n`);

  if (isValid) {
    // 3. 创建用户
    console.log(`3. 创建新用户: ${newUsername}`);
    const user = await prisma.user.create({
      data: {
        username: newUsername,
        phone: newPhone,
        phoneVerified: true,
      },
    });
    console.log(`   用户创建成功: ${user.username} (ID: ${user.id})\n`);

    // 4. 生成 token
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = await createRefreshToken(user.id);
    console.log('4. 生成 Token:');
    console.log(`   accessToken: ${accessToken.substring(0, 50)}...`);
    console.log(`   refreshToken: ${refreshToken.substring(0, 50)}...`);

    // 5. 清理
    await prisma.user.delete({ where: { id: user.id } });
    console.log('\n5. 清理测试用户\n');
  }

  console.log('=== 注册闭环测试完成 ===');
}

async function main() {
  await testLoginFlow();
  await testRegisterFlow();
}

main().catch(console.error);
