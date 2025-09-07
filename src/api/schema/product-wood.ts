import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productUnitsSchema} from './product-unit';
import {woodTypeSchema} from './wood-type';

const schema = z.object({
  productId: z.string().uuid(),
  woodTypeId: z.string().uuid(),
  quality: z.enum(['0', '1', '2', '3', 'extra', 'premium']).nullish(),
  thickness: z.coerce.number().nullish(),
  width: z.coerce.number().nullish(),
  length: z.coerce.number().nullish(),

  units: productUnitsSchema.schema.pick({unit: true}).array().nullish(),
  woodType: woodTypeSchema.schema.nullish(),
});

const sortKeys = schema.pick({
  woodTypeId: true,
  quality: true,
  thickness: true,
  length: true,
  width: true,
});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable, sortDirection: sortDirection}).partial();

const getAll = schema.omit({units: true}).partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.omit({units: true}).extend({units: productUnitsSchema.schema.shape.unit.array()});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;

export const productWoodSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
};

export type ProductWoodSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
};
