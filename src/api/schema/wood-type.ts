import {z} from 'zod';
import {commonQuery, sortDirection} from './common';

const schema = z.object({
  id: z.string().uuid(),
  code: z.enum(['dryPlaned', 'regular', 'osina', 'sticky', 'cheap']),
  name: z.string(),
  price: z.coerce.number().nullish(),
  priceSelection: z.coerce.number().nullish(),
  priceNonCash: z.coerce.number().nullish(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
});

const sortable = schema
  .pick({
    code: true,
    name: true,
    price: true,
    priceSelection: true,
    priceNonCash: true,
  })
  .keyof();
const sort = z.object({sortBy: sortable, sortDirection: sortDirection}).partial();

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.omit({id: true});

const edit = schema.omit({id: true}).partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const woodTypeSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type WoodTypeSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
