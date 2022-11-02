// import ServerlessClient from 'serverless-postgres';
import { middyfy } from '../../libs/lambda';
import dotenv from 'dotenv';
dotenv.config();

const catalogBatchProcess = async (event, context) => {
  console.log('New request ', event);

  // const client = new ServerlessClient({
  //   user: process.env.RDS_USER,
  //   host: process.env.RDS_HOST,
  //   database: process.env.RDS_DB,
  //   password: process.env.RDS_PASSWORD,
  //   port: parseInt(process.env.RDS_PORT),
  //   debug: true,
  //   delayMs: 3000,
  // });
  try {
    // await client.connect();
    // const {
    //   rows: [product],
    // } = await client.query(
    //   `INSERT INTO products (title, description, price)
    // VALUES ($1,
    //         $2,
    //         $3)`,
    //   [title, description, +price]
    // );
    // await client.clean();
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(catalogBatchProcess);
