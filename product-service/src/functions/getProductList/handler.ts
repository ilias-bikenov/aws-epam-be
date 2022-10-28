import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import mockProducts from '../mockProducts';

const getProductList: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context,
) => {
  return formatJSONResponse({
    data: mockProducts,
  });
};

export const main = middyfy(getProductList);
