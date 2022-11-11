import { APIGatewayAuthorizerCallback } from 'aws-lambda';

const basicAuthorizer = async (
  event,
  ctx,
  cb: APIGatewayAuthorizerCallback
) => {
  console.log(event);
  const authorizationToken = event.authorizationToken;
  if (!authorizationToken) return cb('Unauthorized');

  const encodedCreds = authorizationToken.split(' ')[1];
  const plainCreds = Buffer.from(encodedCreds, 'base64').toString().split(':');
  const username = plainCreds[0];
  const password = plainCreds[1];

  console.log(`Username: ${username}, password: ${password}`);

  const storedUserPassword = process.env[username];
  const effect =
    !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

  const policy = generatePolicy(encodedCreds, event.methodArn, effect);

  cb(null, policy);
};

function generatePolicy(principalId, resource, effect = 'Allow') {
  return {
    principalId: principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}
export const main = basicAuthorizer;
