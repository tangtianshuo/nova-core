import redis from '../../lib/redis.js';
import { config } from '../../config/index.js';

// 登录验证码: sms:code:login:{phone}
// 注册验证码: sms:code:register:{phone}
export const SMS_LOGIN_CODE_PREFIX = 'sms:code:login:';
export const SMS_REGISTER_CODE_PREFIX = 'sms:code:register:';

/**
 * 生成指定长度的数字验证码
 */
function generateCode(length: number = 6): string {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * Math.pow(10, length - 1) * 9
  )
    .toString()
    .padStart(length, '0');
}

/**
 * 存储验证码到Redis
 * @param phone 手机号
 * @param code 验证码
 * @param type 验证码类型 ('login' | 'register')
 */
export async function storeSmsCode(phone: string, code: string, type: 'login' | 'register'): Promise<void> {
  const prefix = type === 'login' ? SMS_LOGIN_CODE_PREFIX : SMS_REGISTER_CODE_PREFIX;
  const key = `${prefix}${phone}`;
  const ttl = config.sms?.code?.ttlSeconds ?? 300;
  await redis.set(key, code, 'EX', ttl);
}

/**
 * 从Redis获取验证码
 * @param phone 手机号
 * @param type 验证码类型 ('login' | 'register')
 */
export async function getSmsCode(phone: string, type: 'login' | 'register'): Promise<string | null> {
  const prefix = type === 'login' ? SMS_LOGIN_CODE_PREFIX : SMS_REGISTER_CODE_PREFIX;
  const key = `${prefix}${phone}`;
  return redis.get(key);
}

/**
 * 删除验证码(验证成功后调用)
 * @param phone 手机号
 * @param type 验证码类型 ('login' | 'register')
 */
export async function deleteSmsCode(phone: string, type: 'login' | 'register'): Promise<void> {
  const prefix = type === 'login' ? SMS_LOGIN_CODE_PREFIX : SMS_REGISTER_CODE_PREFIX;
  const key = `${prefix}${phone}`;
  await redis.del(key);
}

/**
 * 生成并存储验证码的主函数
 * 返回生成的验证码（供发送短信使用）
 * @param phone 手机号
 * @param type 验证码类型 ('login' | 'register')
 */
export async function createAndStoreSmsCode(phone: string, type: 'login' | 'register'): Promise<string> {
  const length = config.sms?.code?.length ?? 6;
  const code = generateCode(length);
  await storeSmsCode(phone, code, type);
  return code;
}

export { generateCode };
