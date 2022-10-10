import { describe, expect, test } from '@jest/globals';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { main as getProductList } from './handler';
describe('product service', () => {
  test('get product list', async () => {
    const event = {} as APIGatewayEvent;
    const context = {} as Context;
    const res: APIGatewayProxyResult = await getProductList(event, context);

    expect(Array.isArray(JSON.parse(res.body).data)).toBeTruthy();
  });
});
