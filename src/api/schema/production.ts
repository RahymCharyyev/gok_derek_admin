import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productionItemSchema, productionItemTypes} from './production-item';

const schema = z.object({
  id: z.string().uuid(),

  storeId: z.string().uuid().nullish(),
  createdById: z.string().uuid(),

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
});

const sortable = schema.pick({storeId: true, createdAt: true}).keyof();

const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const resData = schema.extend({
  items: productionItemSchema.schema.array(),
});

const getAll = schema
  .extend({
    storeId: z.string().uuid(),
  })
  .partial()
  .merge(sort)
  .merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: resData.partial().array(),
});

const getOneRes = resData.partial();

const create = schema.pick({storeId: true}).extend({
  items: z.object({productId: z.string().uuid(), type: productionItemTypes, amount: z.number().min(0)}).array(),
});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const productionSchema = {
  schema,
  getAll,
  create,
  edit,
  getAllRes,
  getOneRes,
};

export type ProductionSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
