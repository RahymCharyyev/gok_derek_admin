import {z} from 'zod';
import {commonQuery, sortDirection} from './common';

const schema = z.object({
  storeId: z.string().uuid(),
  type: z.enum(['wood', 'furniture']),
});

const sortKeys = schema.pick({type: true, storeId: true});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable.default('type'), sortDirection: sortDirection.default('desc')});

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({type: true});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;

export const storeWorkshopSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
};

export type StoreWorkshopSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
};
