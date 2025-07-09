import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { contract } from '@contracts/contracts/index';
import Cookies from 'js-cookie';

export const API_URL = import.meta.env.VITE_API_URL;

export const tsrLogin = initTsrReactQuery(contract, {
  baseUrl: API_URL,
  // credentials: 'include',
});

export const tsr = initTsrReactQuery(contract, {
  baseUrl: API_URL,
  baseHeaders: {
    Authorization: () => {
      try {
        const token = JSON.parse(Cookies.get('token') || '');
        if (!token) {
          window.location.href = '/gokderek/login';
          return '';
        }
        return `Bearer ${token}`;
      } catch (err) {
        window.location.href = '/gokderek/login';
        return '';
      }
    },
  },
  // credentials: 'include',
});
