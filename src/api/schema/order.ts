import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productSchema} from './product';
import {userSchema} from './user';

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'closed']),
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().nullish(),
  createdById: z.string().uuid(),

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  createdBy: z.lazy(() => userSchema.schema.partial().nullish()),
  product: z.lazy(() => productSchema.schema.partial().nullish()),
});

const sortable = schema.pick({status: true, createdAt: true}).keyof();

const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const getAll = schema
  .extend({productType: z.lazy(() => productSchema.schema.shape.type)})
  .partial()
  .merge(sort)
  .merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({productId: true, quantity: true});

const edit = schema.pick({quantity: true});

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const orderSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type OrderSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
