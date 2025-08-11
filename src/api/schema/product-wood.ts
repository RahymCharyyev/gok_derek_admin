import {z} from 'zod';
import {commonQuery, sortDirection} from './common';

const schema = z.object({
  productId: z.string().uuid(),
  type: z.enum(['dryPlaned', 'regular', 'osina', 'sticky', 'cheap']),
  quality: z.enum(['1', '2', '3', 'extra', 'premium']).nullish(),
  unit: z.enum(['piece', 'meter', 'sqMeter']).nullish(),
  thickness: z.coerce.number().nullish(),
  width: z.coerce.number().nullish(),
  length: z.coerce.number().nullish(),
});

const sortable = schema
  .pick({
    type: true,
    unit: true,
    quality: true,
  })
  .keyof();
const sort = z.object({sortBy: sortable, sortDirection: sortDirection}).partial();

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema;

const edit = schema.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const productWoodSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type ProductWoodSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
