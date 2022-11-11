import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          name: 'basicAuthorizer',
          arn: 'arn:aws:lambda:us-east-1:816182654924:function:authorization-service-dev-basicAuthorizer',
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      },
    },
  ],
};
