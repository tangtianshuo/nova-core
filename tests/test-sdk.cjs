const Dypnsapi20170525 = require('@alicloud/dypnsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');

const Client = Dypnsapi20170525.default;
require('dotenv').config();

const accessKeyId = process.env.ALIYUN_SMS_ACCESS_KEY_ID;
const accessKeySecret = process.env.ALIYUN_SMS_ACCESS_KEY_SECRET;
const signName = process.env.ALIYUN_SMS_SIGN_NAME || '速通互联验证码';
const templateCode = process.env.ALIYUN_SMS_TEMPLATE_CODE || '100001';
const templateParamTemplate = process.env.ALIYUN_SMS_TEMPLATE_PARAM || '{"code":"##code##","min":"5"}';

const openApiConfig = new OpenApi.Config({
  accessKeyId: accessKeyId,
  accessKeySecret: accessKeySecret,
});
openApiConfig.endpoint = 'dypnsapi.aliyuncs.com';

const client = new Client(openApiConfig);

const code = '123456';
const phone = '18851772903';
const templateParam = templateParamTemplate.replace(/##code##/g, code);

const request = new Dypnsapi20170525.SendSmsVerifyCodeRequest({
  phoneNumber: phone,
  signName: signName,
  templateCode: templateCode,
  templateParam: templateParam,
});

const runtime = new Util.RuntimeOptions({});

async function test() {
  console.log('Sending SMS to', phone, 'with code', code);
  try {
    const resp = await client.sendSmsVerifyCodeWithOptions(request, runtime);
    console.log('Response:', JSON.stringify(resp, null, 2));
  } catch (error) {
    console.log('Error message:', error.message);
    console.log('Recommend:', error.data?.Recommend);
  }
}

test();
