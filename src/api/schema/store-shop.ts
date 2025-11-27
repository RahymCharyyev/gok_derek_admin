import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {userSchema} from './user';
import {paymentTransactionSchema} from './payment-transaction';

const schema = z.object({
  storeId: z.string().uuid(),
  type: z.enum(['wood', 'furniture']),
  userId: z.string().uuid(),
  address: z.string(),
  geoLocation: z.string().nullish(),
  creditLimit: z.coerce.number().int().nullish(),

  user: userSchema.schema.partial().nullish(),
});

const sortKeys = schema.pick({storeId: true, userId: true, address: true, geoLocation: true, creditLimit: true});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable.default('storeId'), sortDirection: sortDirection.default('desc')});

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({userId: true, address: true, geoLocation: true, creditLimit: true, type: true});

const edit = create.partial();

const addOrder = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().nullish(),
  storeId: z.string().uuid().optional(),
});
const transferProduct = z.object({
  productId: z.string().uuid(),
  toStoreId: z.string().uuid(),
  quantity: z.number().int(),
});
const addExpense = z.object({
  amount: z.coerce.number().int(),
  note: z.string().nullish(),
  clientId: z.string().uuid().nullish(),
});
const addIncome = z.object({
  amount: z.coerce.number().int(),
  note: z.string().nullish(),
  clientId: z.string().uuid().nullish(),
});

const sale = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int(),
  method: paymentTransactionSchema.schema.shape.method,
  note: z.string().nullish(),
  clientId: z.string().uuid().nullish(),
  customPrice: z.coerce.number().int().nullish(),
});

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;
type AddOrder = z.infer<typeof addOrder>;
type TransferProduct = z.infer<typeof transferProduct>;
type AddExpense = z.infer<typeof addExpense>;
type AddIncome = z.infer<typeof addIncome>;
type Sale = z.infer<typeof sale>;

export const storeShopSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
  addOrder,
  transferProduct,
  addExpense,
  addIncome,
  sale,
};

export type StoreShopSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
  AddOrder: AddOrder;
  TransferProduct: TransferProduct;
  AddExpense: AddExpense;
  AddIncome: AddIncome;
  Sale: Sale;
};
