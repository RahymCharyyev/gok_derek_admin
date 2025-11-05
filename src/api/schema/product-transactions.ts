import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productSchema} from './product';
import {storeSchema} from './store';
import {userSchema} from './user';
import {storeWorkshopSchema} from './store-workshop';
import {orderSchema} from './order';
import {productWoodSchema} from './product-wood';

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['transfer', 'sale', 'production', 'receipt']),
  orderId: z.string().uuid().nullish(),
  createdById: z.string().uuid(),
  productId: z.string().uuid(),
  fromStoreId: z.string().uuid(),
  toStoreId: z.string().uuid().nullish(),
  quantity: z.coerce.number().int().nullish(),
  price: z.coerce.number().int().nullish(),
  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  product: z.lazy(() => productSchema.schema.partial().nullish()),
  fromStore: z.lazy(() => storeSchema.schema.partial().nullish()),
  toStore: z.lazy(() => storeSchema.schema.partial().nullish()),
  createdBy: z.lazy(() => userSchema.schema.partial().nullish()),
  order: z.lazy(() => orderSchema.schema.partial().nullish()),
});

const sortKeys = schema.pick({
  type: true,
  productId: true,
  fromStoreId: true,
  toStoreId: true,
  quantity: true,
  price: true,
  createdAt: true,
});

const sortable = sortKeys
  .merge(productSchema.sortKeys)
  .merge(productWoodSchema.sortKeys.pick({woodTypeId: true, quality: true, thickness: true, length: true, width: true}))
  .keyof();
const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const getAll = schema
  .extend({
    storeType: z.lazy(() => storeSchema.schema.shape.type),
    storeId: z.lazy(() => storeSchema.schema.shape.id),
    workshopType: z.lazy(() => storeWorkshopSchema.schema.shape.type),
    productType: z.lazy(() => productSchema.schema.shape.type),
  })
  .partial()
  .merge(sort)
  .merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({
  type: true,
  productId: true,
  fromStoreId: true,
  toStoreId: true,
  quantity: true,
  price: true,
  orderId: true,
});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const productTransactionSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
};

export type ProductTransactionSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
