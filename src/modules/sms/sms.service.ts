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

// 安全相关 Redis key 前缀
export const SMS_LAST_SEND_PREFIX = 'sms:last_send:';      // 60秒发送限制
export const SMS_FAIL_COUNT_PREFIX = 'sms:fail_count:';    // 失败次数计数
export const SMS_LOCKED_PREFIX = 'sms:locked:';            // 锁定标志
export const SMS_SEND_COUNT_PREFIX = 'sms:send_count:';    // 每日发送统计

const MAX_FAIL_ATTEMPTS = 5;
const LOCK_DURATION_SECONDS = 900; // 15分钟

/**
 * 掩码手机号: 13812345678 -> 138****5678
 */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return '****';
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

/**
 * 检查手机号是否可以发送短信 (60秒限制)
 * @returns true 表示可以发送，false 表示被限流
 */
export async function canSendSms(phone: string): Promise<boolean> {
  const key = `${SMS_LAST_SEND_PREFIX}${phone}`;
  const lastSend = await redis.get(key);
  return !lastSend;
}

/**
 * 记录短信发送时间 (设置60秒TTL)
 */
export async function recordSmsSend(phone: string): Promise<void> {
  const key = `${SMS_LAST_SEND_PREFIX}${phone}`;
  await redis.set(key, Date.now().toString(), 'EX', 60);
}

/**
 * 检查手机号是否被锁定
 * @returns true 表示被锁定，false 表示正常
 */
export async function isPhoneLocked(phone: string): Promise<boolean> {
  const key = `${SMS_LOCKED_PREFIX}${phone}`;
  const locked = await redis.get(key);
  return locked === '1';
}

/**
 * 增加失败计数，达到5次时锁定15分钟
 * @returns true 表示刚刚被锁定，false 表示还未锁定
 */
export async function incrementFailCount(phone: string): Promise<boolean> {
  const countKey = `${SMS_FAIL_COUNT_PREFIX}${phone}`;
  const lockKey = `${SMS_LOCKED_PREFIX}${phone}`;

  // 原子操作: INCR 和 EXPIRE
  const pipeline = redis.multi();
  pipeline.incr(countKey);
  pipeline.expire(countKey, LOCK_DURATION_SECONDS);
  const results = await pipeline.exec();

  const count = results?.[0]?.[1] as number;
  if (count >= MAX_FAIL_ATTEMPTS) {
    // 锁定手机号
    await redis.set(lockKey, '1', 'EX', LOCK_DURATION_SECONDS);
    await redis.del(countKey); // 锁定后重置计数器
    return true; // 已锁定
  }
  return false; // 未锁定
}

/**
 * 验证成功后重置失败计数
 */
export async function resetFailCount(phone: string): Promise<void> {
  const countKey = `${SMS_FAIL_COUNT_PREFIX}${phone}`;
  await redis.del(countKey);
}

/**
 * 获取当天发送次数
 */
export async function getTodaySendCount(phone: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `${SMS_SEND_COUNT_PREFIX}${phone}:${today}`;
  const count = await redis.get(key);
  return count ? parseInt(count, 10) : 0;
}

/**
 * 增加发送计数并返回当天总数
 */
export async function incrementSendCount(phone: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const key = `${SMS_SEND_COUNT_PREFIX}${phone}:${today}`;
  const pipeline = redis.multi();
  pipeline.incr(key);
  pipeline.expire(key, 86400); // 24小时
  const results = await pipeline.exec();
  return results?.[0]?.[1] as number ?? 0;
}
