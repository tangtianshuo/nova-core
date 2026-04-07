import { Request, Response } from 'express';
import { createAndStoreSmsCode, getSmsCode, deleteSmsCode } from './sms.service.js';
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
 * POST /auth/sms/send
 * 发送短信验证码
 * Body: { phone: string, type: 'login' | 'register' }
 * Returns: { success: true, message: '验证码已发送' }
 */
export const sendSmsCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, type } = req.body;

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

    // 生成并存储验证码
    const code = await createAndStoreSmsCode(phone, type);

    // 发送短信
    const result = await sendSms(phone, code);

    if (!result.success) {
      console.error('SMS send failed:', result.error);
      res.status(500).json({ error: '短信发送失败' });
      return;
    }

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

    if (!phone || !code) {
      res.status(400).json({ error: '手机号和验证码都是必填项' });
      return;
    }

    if (!isValidChinesePhone(phone)) {
      res.status(400).json({ error: '手机号格式无效' });
      return;
    }

    // 验证验证码 (使用login prefix)
    const storedCode = await getSmsCode(phone, 'login');
    if (!storedCode || storedCode !== code) {
      // 使用通用错误信息，不区分是过期还是错误
      res.status(401).json({ error: '验证码错误' });
      return;
    }

    // 验证成功后立即删除验证码 (单次使用)
    await deleteSmsCode(phone, 'login');

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

    // 验证验证码 (使用register prefix)
    const storedCode = await getSmsCode(phone, 'register');
    if (!storedCode || storedCode !== code) {
      res.status(401).json({ error: '验证码错误' });
      return;
    }

    // 验证成功后立即删除验证码
    await deleteSmsCode(phone, 'register');

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
