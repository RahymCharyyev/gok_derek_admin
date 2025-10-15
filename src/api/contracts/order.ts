import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {orderSchema} from '../schema';
import {paramsId} from '../schema/common';

const c = initContract();

export const orderContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: orderSchema.getAll,
      responses: {
        200: orderSchema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: orderSchema.create,
      responses: {
        201: orderSchema.getOneRes,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        200: orderSchema.getOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: paramsId,
      body: orderSchema.edit,
      responses: {
        201: orderSchema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        201: orderSchema.getOneRes,
      },
    },
  },
  {pathPrefix: '/api/orders'},
);
