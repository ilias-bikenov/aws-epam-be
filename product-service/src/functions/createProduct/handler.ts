// import DBFactory, { dbNames } from '../../db/dbFactory';
import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import ServerlessClient from 'serverless-postgres';
import dotenv from 'dotenv';
dotenv.config();

const createProduct: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context
) => {
  console.log('New request ', event);
  const { title, description, price } = event.body;
  if (!title || !description || !price) {
    return {
      statusCode: 400,
      body: JSON.stringify(`Incorrect data is provided`, null, 2),
    };
  }
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
    const {
      rows: [product],
    } = await client.query(
      `INSERT INTO products (title, description, price)
    VALUES ($1,
            $2,
            $3)`,
      [title, description, +price]
    );
    await client.clean();
    return formatJSONResponse({
      message: 'Item created successfully',
    });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(`Internal error ${error}`, null, 2),
    };
  }
};

export const main = middyfy(createProduct);
