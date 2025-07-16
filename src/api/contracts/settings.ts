import {initContract} from '@ts-rest/core';
import {z} from 'zod';
import {settings, settingsAdd, settingsEdit, settingsGetAll, settingsGetAllRes} from '../schema/settings';

const c = initContract();

export const settingsContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '/',
      query: settingsGetAll,
      responses: {
        200: settingsGetAllRes,
      },
    },
    create: {
      method: 'POST',
      path: '/',
      body: settingsAdd,
      responses: {
        201: settings.nullish(),
      },
    },
    getOne: {
      method: 'GET',
      path: '/:key',
      pathParams: settings.pick({key: true}),
      responses: {
        200: settings.partial(),
        404: z.null(),
      },
    },
    edit: {
      method: 'PUT',
      path: '/:key',
      pathParams: settings.pick({key: true}),
      body: settingsEdit,
      responses: {
        201: settings.nullish(),
      },
    },
  },
  {pathPrefix: '/api/settings'},
);
