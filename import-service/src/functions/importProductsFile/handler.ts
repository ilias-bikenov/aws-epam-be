import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as dotenv from 'dotenv';
dotenv.config();
import * as AWS from 'aws-sdk';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event
) => {
  try {
    const s3 = new AWS.S3();
    const { name } = event.queryStringParameters;
    const bucket = process.env.BUCKET;
    const uploadParams = {
      Bucket: bucket,
      Key: `uploaded/${name}`,
    };
    const signedUrl = await s3.getSignedUrl('putObject', uploadParams);

    return formatJSONResponse({
      signedUrl,
    });
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify(`Internal error`, null, 2),
    };
  }
};

export const main = middyfy(importProductsFile);
