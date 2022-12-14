import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import mockProducts from '../mockProducts';
import ServerlessClient from 'serverless-postgres';
import dotenv from 'dotenv';
dotenv.config();

const getProductList: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context
) => {
  console.log('New request ', event);

  const client = new ServerlessClient({
    user: process.env.RDS_USER,
    host: process.env.RDS_HOST,
    database: process.env.RDS_DB,
    password: process.env.RDS_PASSWORD,
    port: parseInt(process.env.RDS_PORT),
    debug: true,
    delayMs: 3000,
  });

  try {
    await client.connect();
    const { rows: products } = await client.query('SELECT * FROM products');
    await client.clean();
    return formatJSONResponse({
      products,
    });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(`Internal error ${error}`, null, 2),
    };
  }
};

export const main = middyfy(getProductList);
