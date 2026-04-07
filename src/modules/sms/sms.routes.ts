import { Router } from 'express';
import { sendSmsCode, smsLogin, smsRegister } from './sms.controller.js';

const router = Router();

/**
 * POST /auth/sms/send
 * 发送短信验证码
 * Body: { phone: string, type: 'login' | 'register' }
 * Returns: { success: true, message: '验证码已发送' }
 */
router.post('/send', sendSmsCode);

/**
 * POST /auth/sms/login
 * 手机号+验证码登录
 * Body: { phone: string, code: string }
 * Returns: { accessToken, refreshToken, expiresIn }
 */
router.post('/login', smsLogin);

/**
 * POST /auth/sms/register
 * 手机号+验证码注册
 * Body: { phone: string, code: string, username: string }
 * Returns: { user, accessToken, refreshToken, expiresIn, message }
 */
router.post('/register', smsRegister);

export default router;
