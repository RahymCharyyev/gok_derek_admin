import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productWoodSchema} from './product-wood';

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['wood', 'furniture', 'other']),
  name: z.string(),
  code: z.string(),
  price: z.coerce.number().int().nullish(),
  priceSelection: z.coerce.number().int().nullish(),
  priceNonCash: z.coerce.number().int().nullish(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  wood: productWoodSchema.schema.nullish(),
});

const sortable = schema
  .pick({
    type: true,
    name: true,
    price: true,
    createdAt: true,
  })
  .keyof();
const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')}).partial();

const getAll = schema.extend({text: z.string()}).partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const createItem = schema.pick({
  name: true,
  code: true,
  price: true,
  priceSelection: true,
  priceNonCash: true,
});

const create = z.discriminatedUnion('type', [
  z.object({type: z.literal('wood'), wood: productWoodSchema.create.omit({productId: true})}).merge(createItem),
  z.object({type: z.literal('furniture')}).merge(createItem),
  z.object({type: z.literal('other')}).merge(createItem),
]);

const edit = schema.pick({name: true, price: true, priceNonCash: true, priceSelection: true}).partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const productSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type ProductSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
