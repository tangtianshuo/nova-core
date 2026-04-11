import { sendSms } from './src/modules/sms/sms.sdk.js';

async function test() {
  console.log('=== Testing SMS send ===');
  console.log('phone: 18851772903, code: 123456');
  const result = await sendSms('18851772903', '123456');
  console.log('Result:', result);
}

test().catch(console.error);
