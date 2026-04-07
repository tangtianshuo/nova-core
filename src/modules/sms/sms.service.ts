import redis from '../../lib/redis.js';
import { config } from '../../config/index.js';
import { SMS_CODE_PREFIX } from './sms.types.js';

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
 */
export async function storeSmsCode(phone: string, code: string): Promise<void> {
  const key = `${SMS_CODE_PREFIX}${phone}`;
  const ttl = config.sms?.code?.ttlSeconds ?? 300;
  await redis.set(key, code, 'EX', ttl);
}

/**
 * 从Redis获取验证码
 */
export async function getSmsCode(phone: string): Promise<string | null> {
  const key = `${SMS_CODE_PREFIX}${phone}`;
  return redis.get(key);
}

/**
 * 删除验证码(验证成功后调用)
 */
export async function deleteSmsCode(phone: string): Promise<void> {
  const key = `${SMS_CODE_PREFIX}${phone}`;
  await redis.del(key);
}

/**
 * 生成并存储验证码的主函数
 * 返回生成的验证码（供发送短信使用）
 */
export async function createAndStoreSmsCode(phone: string): Promise<string> {
  const length = config.sms?.code?.length ?? 6;
  const code = generateCode(length);
  await storeSmsCode(phone, code);
  return code;
}

export { generateCode };
