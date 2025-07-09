import {z} from 'zod';
import {commonQuery} from './common';

export const user = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: z.enum(['admin', 'seller', 'accountant', 'store', 'furniture']),
  password: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().email().nullish(),
  createdAt: z.coerce.date(),
});

export const userGetAll = user.partial().merge(commonQuery);
export const userGetAllRes = z.object({count: z.number(), data: user.omit({password: true}).array()});
export const userGetOneRes = user.omit({password: true});
export const userCreate = user.pick({
  username: true,
  role: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  email: true,
});
export const userEdit = user
  .pick({username: true, role: true, password: true, firstName: true, lastName: true, phone: true, email: true})
  .partial();
export const userEditRes = user.omit({password: true});

export type User = z.infer<typeof user>;
export type UserGetAll = z.infer<typeof userGetAll>;
export type UserCreate = z.infer<typeof userCreate>;
export type UserEdit = z.infer<typeof userEdit>;
