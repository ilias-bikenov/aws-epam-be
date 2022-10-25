import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import ServerlessClient from 'serverless-postgres';
import dotenv from 'dotenv';
dotenv.config();

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context
) => {
  console.log('New request ', event);

  const { productId } = event.pathParameters;
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
    } = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
    await client.clean();
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify(`Product with id ${productId} not found`, null, 2),
      };
    }
    return formatJSONResponse({
      product,
    });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(`Internal error ${error}`, null, 2),
    };
  }
};

export const main = middyfy(getProductById);
