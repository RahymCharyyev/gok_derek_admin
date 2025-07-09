import {initContract} from '@ts-rest/core';
import {pokemonContract} from './pokemon';
import {userContract} from './user';
import {authContract} from './auth';

const c = initContract();

export const contract = c.router({
  pokemon: pokemonContract,
  user: userContract,
  auth: authContract,
});
