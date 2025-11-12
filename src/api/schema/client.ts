import {z} from 'zod';
import {commonQuery, sortDirection, paymentMethods} from './common';

const schema = z.object({
  id: z.string().uuid(),

  fullName: z.string().min(1).max(100),
  phone: z.string().min(7).max(15).nullish(),

  createdById: z.string().uuid(),

  createdAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullish(),
});

const sortable = schema.pick({phone: true, createdAt: true}).keyof();

const sort = z.object({sortBy: sortable.default('createdAt'), sortDirection: sortDirection.default('desc')});

const getAll = schema
  .extend({
    storeId: z.string().uuid(),
    paymentMethod: paymentMethods,
  })
  .partial()
  .merge(sort)
  .merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.extend({totalPayments: z.coerce.number().nullable().default(0)}).array(),
});

const getOneRes = schema;

const create = schema.pick({fullName: true, phone: true});

const edit = schema.pick({fullName: true, phone: true});

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const clientSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type ClientSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
