import {z} from 'zod';
import {commonQuery, sortDirection} from './common';

const schema = z.object({
  productId: z.string().uuid(),
  unit: z.string().nullish(),
});

const sortKeys = schema.pick({unit: true});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable, sortDirection: sortDirection}).partial();

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({unit: true});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;

export const productOtherSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
};

export type ProductOtherSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
};
