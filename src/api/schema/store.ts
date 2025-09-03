import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {locationSchema} from './location';
import {userSchema} from './user';

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['wood', 'furniture']),
  userId: z.string().uuid(),
  address: z.string(),
  locationId: z.string().uuid(),
  creditLimit: z.coerce.number().int().nullish(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  user: userSchema.schema.partial().nullish(),
  location: locationSchema.schema.partial().nullish(),
});

const sortable = schema
  .pick({type: true, userId: true, locationId: true, address: true, creditLimit: true, createdAt: true})
  .keyof();

const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({type: true, address: true, locationId: true, userId: true, creditLimit: true});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const storeSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type StoreSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
