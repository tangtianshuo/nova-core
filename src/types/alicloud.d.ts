declare module '@alicloud/dysmsapi-2017-05-25' {
  interface SmsSendRequest {
    PhoneNumbers: string;
    SignName: string;
    TemplateCode: string;
    TemplateParam?: string;
  }

  interface SmsSendResponse {
    Message: string;
    RequestId: string;
    BizId: string;
    Code: string;
  }

  class Dysmsapi {
    constructor(config: {
      accessKeyId: string;
      accessKeySecret: string;
      endpoint: string;
      apiVersion: string;
    });

    sendSms(request: SmsSendRequest): Promise<SmsSendResponse>;
  }

  export default Dysmsapi;
}
