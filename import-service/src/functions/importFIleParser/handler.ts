import { middyfy } from '@libs/lambda';
import * as dotenv from 'dotenv';
dotenv.config();
import { S3 } from '@aws-sdk/client-s3';
import csv from 'csv-parser';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const importFileParser = async (event) => {
  try {
    const s3 = new S3({});
    const sqsClient = new SQSClient({ region: process.env.REGION });
    const putObjectKey = event.Records[0].s3.object.key;
    const bucketName = process.env.BUCKET;

    const csvStream = await s3.getObject({
      Bucket: bucketName,
      Key: putObjectKey,
    });

    const csvParseStream = (stream) =>
      new Promise((resolve, reject) => {
        stream.Body.pipe(csv())
          .on(
            'data',
            async (row) =>
              await sqsClient.send(
                new SendMessageCommand({
                  QueueUrl: process.env.SQS_URL,
                  MessageBody: row,
                })
              )
          )
          .on('error', (error) => {
            console.log(error);
            reject;
          })
          .on('end', resolve);
      });

    await csvParseStream(csvStream);

    await s3.copyObject({
      Bucket: bucketName,
      CopySource: `${bucketName}/${putObjectKey}`,
      Key: putObjectKey.replace('uploaded/', 'parsed/'),
    });

    await s3.deleteObject({
      Bucket: bucketName,
      Key: putObjectKey,
    });
  } catch (err) {
    console.log('Error', err);
    return;
  }
};

export const main = middyfy(importFileParser);
