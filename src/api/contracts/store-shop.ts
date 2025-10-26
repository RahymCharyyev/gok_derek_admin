import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {storeShopSchema as schema, common, productSchema} from '../schema';

const c = initContract();

export const storeShopContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: schema.getAll,
      responses: {
        200: schema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: schema.create,
      responses: {
        201: schema.getOneRes,
      },
    },

    addOrder: {
      method: 'POST',
      path: '/order',
      body: schema.addOrder,
      responses: {
        201: common.result,
      },
    },
    transferProduct: {
      method: 'POST',
      path: '/product-transfer',
      body: schema.transferProduct,
      responses: {
        201: common.result,
      },
    },
    addExpense: {
      method: 'POST',
      path: '/expense',
      body: schema.addExpense,
      responses: {
        201: common.result,
      },
    },
    addIncome: {
      method: 'POST',
      path: '/income',
      body: schema.addIncome,
      responses: {
        201: common.result,
      },
    },
    sale: {
      method: 'POST',
      path: '/sale',
      body: schema.sale,
      responses: {
        201: common.result,
      },
    },
    getProducts: {
      method: 'GET',
      path: '/products/all',
      query: productSchema.getAll,
      responses: {
        200: productSchema.getAllRes,
      },
    },

    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: common.paramsId,
      responses: {
        200: schema.getOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: common.paramsId,
      body: schema.edit,
      responses: {
        201: schema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: common.paramsId,
      responses: {
        201: schema.getOneRes,
      },
    },
  },
  {pathPrefix: '/api/store-shops'},
);
