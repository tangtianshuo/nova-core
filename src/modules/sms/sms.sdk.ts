import Dysmsapi from '@alicloud/dysmsapi-2017-05-25';
import { config } from '../../config/index.js';
import type { SmsSendResult } from './sms.types.js';

const smsConfig = {
  accessKeyId: config.sms?.aliyun?.accessKeyId ?? '',
  accessKeySecret: config.sms?.aliyun?.accessKeySecret ?? '',
  endpoint: 'dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25',
};

export const smsClient = new Dysmsapi(smsConfig);

/**
 * 发送短信验证码
 * 安全要点:
 * - 发送响应只返回success/error，不暴露手机号是否已注册
 * - 日志中只记录RequestId，不记录phone或code
 */
export async function sendSms(phone: string, code: string): Promise<SmsSendResult> {
  try {
    const signName = config.sms?.aliyun?.signName ?? '';
    const templateCode = config.sms?.aliyun?.templateCode ?? '';

    const result = await smsClient.sendSms({
      PhoneNumbers: phone,
      SignName: signName,
      TemplateCode: templateCode,
      TemplateParam: JSON.stringify({ code }),
    });

    // 阿里云返回格式: { Message: 'OK', RequestId: 'xxx', BizId: 'xxx' }
    if (result.Message === 'OK') {
      return {
        success: true,
        messageId: result.RequestId,
      };
    } else {
      return {
        success: false,
        error: result.Message,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
