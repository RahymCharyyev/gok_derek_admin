import {initContract} from '@ts-rest/core';
import {authContract} from './auth';
import {productContract} from './product';
import {settingsContract} from './settings';
import {userContract} from './user';
import {userRoleContract} from './user-role';

const c = initContract();

export const contract = c.router({
  user: userContract,
  userRole: userRoleContract,
  auth: authContract,
  settings: settingsContract,
  product: productContract,
});
