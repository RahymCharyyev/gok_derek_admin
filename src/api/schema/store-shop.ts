import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {userSchema} from './user';

const schema = z.object({
  storeId: z.string().uuid(),
  type: z.enum(['wood', 'furniture']),
  userId: z.string().uuid(),
  address: z.string(),
  geoLocation: z.string().nullish(),
  creditLimit: z.coerce.number().int().nullish(),

  user: userSchema.schema.partial().nullish(),
});

const sortKeys = schema.pick({storeId: true, userId: true, address: true, geoLocation: true, creditLimit: true});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable.default('storeId'), sortDirection: sortDirection.default('desc')});

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({userId: true, address: true, geoLocation: true, creditLimit: true, type: true});

const edit = create.partial();

const addOrder = z.object({productId: z.string().uuid(), quantity: z.coerce.number().int().nullish()});

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;
type AddOrder = z.infer<typeof addOrder>;

export const storeShopSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
  addOrder,
};

export type StoreShopSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
  AddOrder: AddOrder;
};
