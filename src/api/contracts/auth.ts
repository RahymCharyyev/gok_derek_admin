import { initContract } from '@ts-rest/core';
import { login, loginRes, meRes } from '../schema/auth';
import { z } from 'zod';

const c = initContract();

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      body: login,
      responses: {
        201: loginRes,
      },
    },
    me: {
      method: 'GET',
      path: '/me',
      responses: {
        200: meRes,
      },
    },
    logout: {
      method: 'GET',
      path: '/logout',
      responses: {
        200: z.any(),
      },
    },
  },
  { pathPrefix: '/api/auth' }
);
