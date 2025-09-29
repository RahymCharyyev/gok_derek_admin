import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productSchema} from './product';
import {storeSchema} from './store';
import {userSchema} from './user';

const schema = z.object({
  id: z.string().uuid(),
  type: z.enum(['in', 'out']),
  amount: z.coerce.number().int(),
  createdById: z.string().uuid(),

  storeId: z.string().uuid().nullish(),
  productTransactionId: z.string().uuid().nullish(),
  note: z.string().nullish(),

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),

  product: z.lazy(() => productSchema.schema.partial().nullish()),
  store: z.lazy(() => storeSchema.schema.partial().nullish()),
  createdBy: z.lazy(() => userSchema.schema.partial().nullish()),
});

const sortKeys = schema.pick({
  createdAt: true,
  type: true,
  amount: true,
  createdById: true,
  storeId: true,
});

const sortable = sortKeys.merge(productSchema.sortKeys).keyof();
const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const getAll = schema
  .pick({
    id: true,
    type: true,
    amount: true,
    productTransactionId: true,
    createdById: true,
    storeId: true,
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
  amount: true,
  productTransactionId: true,
  storeId: true,
  note: true,
});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const paymentTransactionSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type PaymentTransactionSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
