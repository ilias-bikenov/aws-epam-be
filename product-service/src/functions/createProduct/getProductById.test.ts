import { describe, expect, test } from '@jest/globals';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import mockData from '../mockProducts';
import { main as getProductById } from './handler';
describe('product service', () => {
  test('get product list', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { productId: mockData[0].id },
    } as any;
    event.pathParameters.productId = mockData[0].id;
    const context = {} as Context;
    const res: APIGatewayProxyResult = await getProductById(event, context);

    expect(JSON.parse(res.body)['data']).toEqual(mockData[0]);
  });
});
