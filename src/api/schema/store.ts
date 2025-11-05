import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {storeWarehouseSchema} from './store-warehouse';
import {storeWorkshopSchema} from './store-workshop';
import {storeShopSchema} from './store-shop';

const createWorkshopSchema = (): z.ZodType => storeWorkshopSchema.schema.partial().nullish();
const createShopSchema = (): z.ZodType => storeShopSchema.schema.partial().nullish();
const createWarehouseSchema = (): z.ZodType => storeWarehouseSchema.schema.partial().nullish();

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['warehouse', 'workshop', 'shop']),

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  warehouse: z.lazy(createWarehouseSchema),
  workshop: z.lazy(createWorkshopSchema),
  shop: z.lazy(createShopSchema),
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
