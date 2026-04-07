// SMS验证码存储结构
export interface SmsCodeStore {
  phone: string;
  code: string;
  createdAt: number;
}

// 发送结果
export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  // 安全: 不返回手机号是否存在
}

// SDK配置
export interface SmsConfig {
  accessKeyId: string;
  accessKeySecret: string;
  signName: string;
  templateCode: string;
}

// 验证码选项
export interface SmsCodeOptions {
  length: number;      // 默认6
  ttlSeconds: number;  // 默认300
}

// Redis存储键前缀
export const SMS_CODE_PREFIX = 'sms:code:';
