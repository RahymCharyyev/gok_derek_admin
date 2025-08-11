import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {productSchema} from '../schema';
import {paramsId} from '../schema/common';

const c = initContract();

export const productContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: productSchema.getAll,
      responses: {
        200: productSchema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: productSchema.create,
      responses: {
        201: productSchema.getOneRes,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        200: productSchema.getOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: paramsId,
      body: productSchema.edit,
      responses: {
        201: productSchema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        201: productSchema.getOneRes,
      },
    },
  },
  {pathPrefix: '/api/products'},
);
