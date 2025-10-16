import {z} from 'zod';
import {common, commonQuery, sortDirection} from './common';
import {productFurnitureSchema} from './product-furniture';
import {productOtherSchema} from './product-other';
import {productUnitsSchema} from './product-unit';
import {productWoodSchema} from './product-wood';

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['wood', 'furniture', 'other']),
  name: z.string(),
  price: z.coerce.number().int().nullish(),
  priceSelection: z.coerce.number().int().nullish(),
  priceNonCash: z.coerce.number().int().nullish(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  // wood: productWoodSchema.schema.nullish(),
  // furniture: productFurnitureSchema.schema.nullish(),
  // other: productOtherSchema.schema.nullish(),
  // units: productUnitsSchema.schema.partial().array().nullish(),

  wood: z.lazy(() => productWoodSchema.schema.nullish()),
  furniture: z.lazy(() => productFurnitureSchema.schema.nullish()),
  other: z.lazy(() => productOtherSchema.schema.nullish()),
  units: z.lazy(() => productUnitsSchema.schema.partial().array().nullish()),
  availableProductCount: z.coerce.number().int().nullish(),
  productQuantity: z.coerce.number().int().nullish(),
});

const sortKeys = schema.pick({
  type: true,
  name: true,
  price: true,
  createdAt: true,
});
const sortable = sortKeys.merge(productWoodSchema.sortKeys).keyof();
const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const getAll = schema
  .pick({type: true, name: true, price: true, createdAt: true})
  .extend({
    text: z.string(),
    types: schema.shape.type.array(),
    storeId: z.string().uuid().optional(),
    isAvailable: common.boolStr,
  })
  .partial()
  .merge(sort)
  .merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const createItem = schema.pick({
  name: true,
  price: true,
  priceSelection: true,
  priceNonCash: true,
});

const create = z.discriminatedUnion('type', [
  z.object({type: z.literal('wood'), wood: productWoodSchema.create.omit({productId: true})}).merge(createItem),
  z.object({type: z.literal('furniture')}).merge(createItem),
  z.object({type: z.literal('other'), units: productUnitsSchema.schema.shape.unit.array()}).merge(createItem),
]);

const edit = schema.pick({name: true, price: true, priceNonCash: true, priceSelection: true}).partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type Sortable = z.infer<typeof sortable>;

export const productSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
};

export type ProductSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  Sortable: Sortable;
};
