import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { storeSchema as schema } from '../schema';
import { paramsId } from '../schema/common';

const c = initContract();

export const storeContract = c.router(
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
  { pathPrefix: '/api/stores' }
);
