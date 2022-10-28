import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import mockProducts from '../mockProducts';

const getProductById: ValidatedEventAPIGatewayProxyEvent<any> = async (
  event,
  context,
) => {
  const { productId } = event.pathParameters;
  const data = mockProducts.find((product) => product.id === productId);

  if (!data) {
    return {
      statusCode: 404,
      body: JSON.stringify(`Product with id ${productId} not found`, null, 2),
    };
  }

  return formatJSONResponse({
    data,
  });
};

export const main = middyfy(getProductById);
