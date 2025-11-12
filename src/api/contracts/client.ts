import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {clientSchema} from '../schema';
import {paramsId} from '../schema/common';

const c = initContract();

export const clientContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: clientSchema.getAll,
      responses: {
        200: clientSchema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: clientSchema.create,
      responses: {
        201: clientSchema.getOneRes,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        200: clientSchema.getOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      pathParams: paramsId,
      body: clientSchema.edit,
      responses: {
        201: clientSchema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        201: clientSchema.getOneRes,
      },
    },
  },
  {pathPrefix: '/api/clients'},
);
