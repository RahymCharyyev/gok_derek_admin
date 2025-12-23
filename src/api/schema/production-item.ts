import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productSchema} from './product';
import {productionSchema} from './production';

export const productionItemTypes = z.enum(['in', 'out', 'waste']);

const schema = z.object({
  id: z.string().uuid(),
  productionId: z.string().uuid(),
  productId: z.string().uuid(),
  type: productionItemTypes,

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  product: productSchema.schema.nullish(),
});

const sortKeys = schema.pick({
  createdAt: true,
  type: true,
  productionId: true,
  productId: true,
});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable, sortDirection: sortDirection}).partial();

const getAll = schema.omit({product: true}).partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({productionId: true, productId: true, type: true});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;

export const productionItemSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
};

export type ProductionItemSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
};
