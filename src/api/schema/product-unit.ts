import {z} from 'zod';
import {commonQuery, sortDirection} from './common';

const schema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  unit: z.enum(['piece', 'meter', 'sqMeter']),
});

const sortable = schema.pick({unit: true}).keyof();
const sort = z.object({sortBy: sortable, sortDirection: sortDirection}).partial();

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({productId: true, unit: true});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const productUnitsSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type ProductUnitsSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
