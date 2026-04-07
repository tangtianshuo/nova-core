import { Request, Response } from 'express';
import { createAndStoreSmsCode, getSmsCode, deleteSmsCode,
  canSendSms, recordSmsSend,
  isPhoneLocked, incrementFailCount, resetFailCount,
  getTodaySendCount, incrementSendCount,
  maskPhone } from './sms.service.js';
import { sendSms } from './sms.sdk.js';
import { generateAccessToken, createRefreshToken } from '../auth/auth.service.js';
import { isValidUsername } from '../auth/auth.service.js';
import prisma from '../../lib/prisma.js';
import { config } from '../../config/index.js';

const CHINESE_PHONE_REGEX = /^1[3-9]\d{9}$/;
export function isValidChinesePhone(phone: string): boolean {
  return CHINESE_PHONE_REGEX.test(phone);
}

/**
 * 创建审计日志
 */
async function createAuditLog(params: {
  phone: string;
  action: 'send' | 'verify_success' | 'verify_fail' | 'locked';
  result: 'success' | 'failed' | 'rate_limited' | 'locked';
  ip?: string;
  userAgent?: string;
}): Promise<void> {
  const maskedPhone = maskPhone(params.phone);
  await prisma.smsAuditLog.create({
    data: {
      phone: maskedPhone,
      action: params.action,
      result: params.result,
      ip: params.ip,
      userAgent: params.userAgent,
    },
  });
}

/**
 * POST /auth/sms/send
 * 发送短信验证码
 * Body: { phone: string, type: 'login' | 'register' }
 * Returns: { success: true, message: '验证码已发送' }
 */
export const sendSmsCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, type } = req.body;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    if (!phone || !type) {
      res.status(400).json({ error: '手机号和类型都是必填项' });
      return;
    }

    if (!isValidChinesePhone(phone)) {
      res.status(400).json({ error: '手机号格式无效' });
      return;
    }

    if (type !== 'login' && type !== 'register') {
      res.status(400).json({ error: '类型必须是 login 或 register' });
      return;
    }

    // 60秒发送限制检查
    const allowed = await canSendSms(phone);
    if (!allowed) {
      await createAuditLog({ phone, action: 'send', result: 'rate_limited', ip, userAgent });
      res.status(429).json({ error: '发送过于频繁，请稍后再试' });
      return;
    }

    // 生成并存储验证码
    const code = await createAndStoreSmsCode(phone, type);

    // 发送短信
    const result = await sendSms(phone, code);

    if (!result.success) {
      console.error('SMS send failed:', result.error);
      await createAuditLog({ phone, action: 'send', result: 'failed', ip, userAgent });
      res.status(500).json({ error: '短信发送失败' });
      return;
    }

    // 记录发送时间、增量统计、创建审计日志
    await recordSmsSend(phone);
    await incrementSendCount(phone);
    await createAuditLog({ phone, action: 'send', result: 'success', ip, userAgent });

    // 返回通用响应，不暴露手机号是否已注册
    res.status(200).json({ success: true, message: '验证码已发送' });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

/**
 * POST /auth/sms/login
 * 手机号+验证码登录
 * Body: { phone: string, code: string }
 * Returns: { accessToken, refreshToken, expiresIn }
 */
export const smsLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code } = req.body;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    if (!phone || !code) {
      res.status(400).json({ error: '手机号和验证码都是必填项' });
      return;
    }

    if (!isValidChinesePhone(phone)) {
      res.status(400).json({ error: '手机号格式无效' });
      return;
    }

    // 检查手机号是否被锁定
    const locked = await isPhoneLocked(phone);
    if (locked) {
      await createAuditLog({ phone, action: 'verify_fail', result: 'locked', ip, userAgent });
      res.status(429).json({ error: '验证码错误' }); // 通用错误信息
      return;
    }

    // 验证验证码 (使用login prefix)
    const storedCode = await getSmsCode(phone, 'login');
    if (!storedCode || storedCode !== code) {
      // 增加失败计数
      const nowLocked = await incrementFailCount(phone);
      await createAuditLog({ phone, action: 'verify_fail', result: 'failed', ip, userAgent });

      if (nowLocked) {
        await createAuditLog({ phone, action: 'locked', result: 'locked', ip, userAgent });
      }

      res.status(401).json({ error: '验证码错误' });
      return;
    }

    // 验证成功：重置失败计数，删除验证码
    await resetFailCount(phone);
    await deleteSmsCode(phone, 'login');
    await createAuditLog({ phone, action: 'verify_success', result: 'success', ip, userAgent });

    // 查找用户
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      res.status(404).json({ error: '该手机号未注册' });
      return;
    }

    // 生成令牌
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = await createRefreshToken(user.id);

    res.status(200).json({
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessToken.expiresIn,
    });
  } catch (error) {
    console.error('SMS login error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

/**
 * POST /auth/sms/register
 * 手机号+验证码注册
 * Body: { phone: string, code: string, username: string }
 * Returns: { user, accessToken, refreshToken, expiresIn, message }
 */
export const smsRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, code, username } = req.body;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    if (!phone || !code || !username) {
      res.status(400).json({ error: '手机号、验证码和用户名都是必填项' });
      return;
    }

    if (!isValidChinesePhone(phone)) {
      res.status(400).json({ error: '手机号格式无效' });
      return;
    }

    if (!isValidUsername(username)) {
      res.status(400).json({ error: '用户名格式无效（3-20个字符，仅限字母、数字、下划线、连字符）' });
      return;
    }

    // 检查手机号是否被锁定
    const locked = await isPhoneLocked(phone);
    if (locked) {
      await createAuditLog({ phone, action: 'verify_fail', result: 'locked', ip, userAgent });
      res.status(429).json({ error: '验证码错误' });
      return;
    }

    // 验证验证码 (使用register prefix)
    const storedCode = await getSmsCode(phone, 'register');
    if (!storedCode || storedCode !== code) {
      // 增加失败计数
      const nowLocked = await incrementFailCount(phone);
      await createAuditLog({ phone, action: 'verify_fail', result: 'failed', ip, userAgent });

      if (nowLocked) {
        await createAuditLog({ phone, action: 'locked', result: 'locked', ip, userAgent });
      }

      res.status(401).json({ error: '验证码错误' });
      return;
    }

    // 验证成功：重置失败计数，删除验证码
    await resetFailCount(phone);
    await deleteSmsCode(phone, 'register');
    await createAuditLog({ phone, action: 'verify_success', result: 'success', ip, userAgent });

    // 检查手机号是否已注册
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      res.status(409).json({ error: '该手机号已注册' });
      return;
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      res.status(409).json({ error: '用户名已被使用' });
      return;
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        phone,
        phoneVerified: true,
      },
      select: {
        id: true,
        username: true,
        phone: true,
      },
    });

    // 生成令牌
    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = await createRefreshToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
      expiresIn: config.jwt.accessToken.expiresIn,
      message: '注册成功',
    });
  } catch (error) {
    console.error('SMS register error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};

/**
 * GET /auth/sms/stats
 * 查询当天短信发送统计
 */
export const getSmsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.query;

    if (!phone || !isValidChinesePhone(phone as string)) {
      res.status(400).json({ error: '无效的手机号' });
      return;
    }

    const todayCount = await getTodaySendCount(phone as string);

    res.status(200).json({
      phone: maskPhone(phone as string),
      todaySendCount: todayCount,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error('Get SMS stats error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
};
