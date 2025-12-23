import {initContract} from '@ts-rest/core';
import {authContract} from './auth';
import {clientContract} from './client';
import {orderContract} from './order';
import {paymentTransactionContract} from './payment-transaction';
import {productContract} from './product';
import {productTransactionContract} from './product-transaction';
import {productionContract} from './production';
import {settingsContract} from './settings';
import {storeContract} from './store';
import {storeShopContract} from './store-shop';
import {storeWarehouseContract} from './store-warehouse';
import {storeWorkshopContract} from './store-workshop';
import {userContract} from './user';
import {userRoleContract} from './user-role';
import {woodTypeContract} from './wood-type';

const c = initContract();

export const contract = c.router({
  user: userContract,
  userRole: userRoleContract,
  auth: authContract,
  settings: settingsContract,
  product: productContract,
  woodType: woodTypeContract,
  store: storeContract,
  warehouse: storeWarehouseContract,
  shop: storeShopContract,
  workshop: storeWorkshopContract,
  productTransaction: productTransactionContract,
  paymentTransaction: paymentTransactionContract,
  order: orderContract,
  client: clientContract,
  production: productionContract,
});
