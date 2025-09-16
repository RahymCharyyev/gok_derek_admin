import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { paramsId } from '../schema';
import { userSchema } from '../schema/user';

const c = initContract();

export const userContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/',
      query: userSchema.getAll,
      responses: {
        200: userSchema.getAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '/',
      body: userSchema.create,
      responses: {
        201: userSchema.getOneRes,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        200: userSchema.getOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      body: userSchema.edit,
      pathParams: paramsId,
      responses: {
        201: userSchema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        201: userSchema.getOneRes,
      },
    },
  },
  { pathPrefix: '/api/users' }
);
