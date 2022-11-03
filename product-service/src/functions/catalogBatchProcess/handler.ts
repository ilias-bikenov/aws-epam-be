import ServerlessClient from 'serverless-postgres';
import { middyfy } from '../../libs/lambda';
import dotenv from 'dotenv';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
dotenv.config();

const catalogBatchProcess = async (event, context) => {
  console.log('New request ', event);
  console.log('Messages ', event.Records[0].body);

  const snsClient = new SNSClient({ region: process.env.REGION });

  const client = new ServerlessClient({
    user: process.env.RDS_USER,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DB,
    password: process.env.RDS_PASSWORD,
    port: parseInt(process.env.RDS_PORT),
    debug: true,
    delayMs: 3000,
  });
  await client.connect();

  try {
    for (const message of event.Records) {
      console.log('body parsed', JSON.parse(message.body));
      const { title, description, price } = JSON.parse(message.body);
      await client.query(
        `INSERT INTO products (title, description, price)
        VALUES ($1,
                $2,
                $3)`,
        [title, description, +price]
      );
    }
    await client.clean();

    await snsClient.send(
      new PublishCommand({
        Subject: 'All products were successfully uploaded',
        Message: 'All products from the csv file were uploaded succesfully',
        TopicArn: process.env.SNS_ARN,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(catalogBatchProcess);
