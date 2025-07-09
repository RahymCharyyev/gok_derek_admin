import {initContract} from '@ts-rest/core';
import {PokemonGetAll, Pokemon, PokemonCreate, PokemonEdit} from '../schema/pokemon';
import {z} from 'zod';

const c = initContract();

export const pokemonContract = c.router(
  {
    getPokemonAll: {
      method: 'GET',
      path: '/',
      responses: {
        200: PokemonGetAll,
      },
    },

    createPokemon: {
      method: 'POST',
      path: '/',
      body: PokemonCreate,
      responses: {
        201: Pokemon,
      },
    },
    getPokemon: {
      method: 'GET',
      path: '/:id',
      pathParams: z.object({id: z.string().uuid()}),
      responses: {
        200: Pokemon,
        404: z.any(),
      },
    },

    editPokemon: {
      method: 'PUT',
      path: '/:id',
      body: PokemonEdit,
      responses: {
        201: Pokemon,
      },
    },
  },
  {pathPrefix: '/api/pokemon'},
);
