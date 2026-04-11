/**
 * 完整测试：短信验证码登录/注册闭环
 *
 * 流程：
 * 1. 发送验证码到手机
 * 2. 用户输入验证码
 * 3. 验证验证码并完成登录/注册
 */

import { createAndStoreSmsCode, getSmsCode, verifySmsCode, deleteSmsCode } from './src/modules/sms/sms.service.js';
import prisma from './src/lib/prisma.js';

const TEST_PHONE = '18851772903';
const TEST_CODE = '123456';

async function testFlow() {
  console.log('=== 测试短信验证码登录/注册闭环 ===\n');

  // 1. 发送验证码
  console.log('1. 发送验证码...');
  try {
    const result = await createAndStoreSmsCode(TEST_PHONE, 'login');
    console.log('   发送结果:', result);
  } catch (error) {
    console.log('   发送失败:', error);
  }

  // 2. 获取 Redis 中的验证码（用于测试）
  console.log('\n2. 从 Redis 获取验证码...');
  const storedCode = await getSmsCode(TEST_PHONE, 'login');
  console.log('   存储的验证码:', storedCode);

  // 3. 验证验证码
  console.log('\n3. 验证验证码...');
  const isValid = await verifySmsCode(TEST_PHONE, storedCode || TEST_CODE, 'login');
  console.log('   验证结果:', isValid);

  // 4. 检查用户是否存在
  console.log('\n4. 检查用户是否存在...');
  const user = await prisma.user.findUnique({ where: { phone: TEST_PHONE } });
  console.log('   用户:', user);

  // 5. 清理
  console.log('\n5. 清理测试数据...');
  await deleteSmsCode(TEST_PHONE, 'login');
  console.log('   已删除验证码');

  console.log('\n=== 测试完成 ===');
}

testFlow().catch(console.error);
