import type { AWS } from '@serverless/typescript';

import getProductList from '@functions/getProductList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import dotenv from 'dotenv';
dotenv.config();
const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-postgres'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PGUSER: process.env.RDS_USER,
      PGHOST: process.env.RDS_HOST,
      PGPASSWORD: process.env.RDS_PASSWORD,
      PGDATABASE: process.env.RDS_DB,
      PGPORT: process.env.RDS_PORT,
    },
  },
  // import the function via paths
  functions: { getProductList, getProductById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sd'],
      external: ['pg-native'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
