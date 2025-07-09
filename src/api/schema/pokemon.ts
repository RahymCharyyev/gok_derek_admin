import {z} from 'zod';

export const Pokemon = z.object({
  id: z.coerce.number().int(),
  name: z.string(),
});

export const PokemonGetAll = Pokemon.array().nullish();
export const PokemonCreate = Pokemon.pick({name: true});
export const PokemonEdit = Pokemon.pick({name: true}).partial();
