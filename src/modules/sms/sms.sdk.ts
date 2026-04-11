/**
 * 云通信号码认证服务 SDK
 * 用于发送短信验证码
 */
import { createRequire } from 'module';
import { config } from '../../config/index.js';
import type { SmsSendResult } from './sms.types.js';

// 动态加载模块
const require = createRequire(import.meta.url);
const DypnsapiModule = require('@alicloud/dypnsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');

// Dypnsapi20170525.default 是真正的 Client 类
const Dypnsapi20170525 = DypnsapiModule.default;

/**
 * 创建号码认证服务客户端
 */
function createClient() {
  const openApiConfig = new OpenApi.Config({
    accessKeyId: config.sms?.aliyun?.accessKeyId || '',
    accessKeySecret: config.sms?.aliyun?.accessKeySecret || '',
  });
  openApiConfig.endpoint = 'dypnsapi.aliyuncs.com';
  return new Dypnsapi20170525(openApiConfig);
}

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param code 验证码
 */
export async function sendSms(phone: string, code: string): Promise<SmsSendResult> {
  const accessKeyId = config.sms?.aliyun?.accessKeyId;
  const accessKeySecret = config.sms?.aliyun?.accessKeySecret;
  const signName = config.sms?.aliyun?.signName;
  const templateCode = config.sms?.aliyun?.templateCode;
  const templateParamTemplate = config.sms?.aliyun?.templateParam;

  // 如果没有配置凭证，返回模拟成功（开发模式）
  if (!accessKeyId || !accessKeySecret) {
    const mockMessageId = `mock-${Date.now()}`;
    console.log(`[SMS Mock] 发送验证码到 ${phone.substring(0, 3)}****${phone.slice(-4)}, code: ${code}`);
    return {
      success: true,
      messageId: mockMessageId,
    };
  }

  // 替换模板中的 ##code## 占位符
  const templateParam = templateParamTemplate
    ? templateParamTemplate.replace(/##code##/g, code)
    : JSON.stringify({ code });

  console.log(`[SMS] 发送短信验证码到 ${phone}, code: ${code}`);

  const client = createClient();

  const request = new DypnsapiModule.SendSmsVerifyCodeRequest({
    phoneNumber: phone,
    signName: signName,
    templateCode: templateCode,
    templateParam: templateParam,
  });

  const runtime = new Util.RuntimeOptions({});

  try {
    const resp = await client.sendSmsVerifyCodeWithOptions(request, runtime);
    console.log(`[SMS] 发送结果:`, JSON.stringify(resp.body, null, 2));

    if (resp.body?.code === 'OK') {
      return {
        success: true,
        messageId: resp.body?.requestId || 'unknown',
      };
    } else {
      return {
        success: false,
        error: resp.body?.message || resp.body?.code || 'Unknown error',
      };
    }
  } catch (error: any) {
    console.error(`[SMS] 发送失败:`, error.message);
    console.error(`[SMS] 诊断地址:`, error.data?.Recommend);
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}
