import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {productTransactionSchema, storeWarehouseSchema as schema} from '../schema';
import {common, paramsId} from '../schema/common';

const c = initContract();

export const storeWarehouseContract = c.router(
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

    addProduct: {
      method: 'POST',
      path: '/product-add',
      body: schema.addProduct,
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
    transferOrderedProduct: {
      method: 'POST',
      path: '/product-transfer-ordered',
      body: schema.transferOrderedProduct,
      responses: {
        201: common.result,
      },
    },
    getProducts: {
      method: 'GET',
      path: '/product-get/all',
      query: schema.getProducts,
      responses: {
        200: schema.getProductsRes,
      },
    },
    getSentProducts: {
      method: 'GET',
      path: '/products-sent/all',
      query: productTransactionSchema.getAll,
      responses: {
        200: productTransactionSchema.getAllRes,
      },
    },
    setOrderStatus: {
      method: 'PUT',
      path: '/order/status',
      body: schema.setOrderStatus,
      responses: {
        201: common.result.nullish(),
      },
    },

    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        200: schema.getOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: paramsId,
      body: schema.edit,
      responses: {
        201: schema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        201: schema.getOneRes,
      },
    },
  },
  {pathPrefix: '/api/store-warehouses'},
);
