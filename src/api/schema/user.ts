import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {userRole} from './user-role';

export const user = z.object({
  id: z.string().uuid(),
  username: z.string(),
  password: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().email().nullish(),
  createdAt: z.coerce.date(),
});
export const userExtra = z.object({
  roles: userRole.pick({role: true}).array(),
});

const userSort = user
  .pick({
    username: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
    createdAt: true,
  })
  .keyof();
const sort = z.object({sortBy: userSort.default('createdAt'), sortDirection: sortDirection.default('desc')}).partial();

export const userGetAll = user.extend({text: z.string()}).partial().merge(sort).merge(commonQuery);
export const userGetAllRes = z.object({count: z.number(), data: user.omit({password: true}).merge(userExtra).array()});

export const userGetOneRes = user.omit({password: true}).merge(userExtra).partial().nullish();

export const userCreate = user.pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  email: true,
});
export const userEdit = user
  .pick({username: true, password: true, firstName: true, lastName: true, phone: true, email: true})
  .partial();
export const userEditRes = user.omit({password: true});

export type User = z.infer<typeof user>;
export type UserGetAll = z.infer<typeof userGetAll>;
export type UserCreate = z.infer<typeof userCreate>;
export type UserEdit = z.infer<typeof userEdit>;

export const userSchema = {
  schema: user,
  getAll: userGetAll,
  getAllRes: userGetAllRes,
  getOneRes: userGetOneRes,
  create: userCreate,
  edit: userEdit,
};

export type UserSchema = {
  Schema: User;
  GetAll: UserGetAll;
  Create: UserCreate;
  Edit: UserEdit;
};
