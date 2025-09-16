import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userRole } from '../schema/user-role';

const c = initContract();

export const userRoleContract = c.router(
  {
    add: {
      method: 'POST',
      path: '/add',
      body: userRole,
      responses: {
        201: userRole.nullish(),
        404: z.any(),
      },
    },

    remove: {
      method: 'POST',
      path: '/remove',
      body: userRole,
      responses: {
        201: userRole,
      },
    },
  },
  { pathPrefix: '/api/user-roles' }
);
