import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {user, userCreate, userEdit, userEditRes, userGetAll, userGetAllRes, userGetOneRes} from '../schema/user';

const c = initContract();

export const userContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/',
      query: userGetAll,
      responses: {
        200: userGetAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '/',
      body: userCreate,
      responses: {
        201: user,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {
        200: userGetOneRes,
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      body: userEdit,
      pathParams: z.object({id: z.string().uuid()}),
      responses: {
        201: userEditRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {
        201: userEditRes,
      },
    },
  },
  {pathPrefix: '/api/users'},
);
