import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {storeWarehouseSchema} from './store-warehouse';
import {storeWorkshopSchema} from './store-workshop';
import {storeShopSchema} from './store-shop';

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['warehouse', 'workshop', 'shop']),

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  // warehouse: storeWarehouseSchema.schema.partial().nullish(),
  // workshop: storeWorkshopSchema.schema.partial().nullish(),
  // shop: storeShopSchema.schema.partial().nullish(),

  warehouse: z.lazy(() => storeWarehouseSchema.schema.partial().nullish()),
  workshop: z.lazy(() => storeWorkshopSchema.schema.partial().nullish()),
  shop: z.lazy(() => storeShopSchema.schema.partial().nullish()),
});

const sortable = schema.pick({type: true, createdAt: true}).keyof();

const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

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

export const storeSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type StoreSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
