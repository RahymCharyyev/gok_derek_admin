import {z} from 'zod';
import {commonQuery, sortDirection} from './common';
import {productSchema} from './product';

const schema = z.object({
  storeId: z.string().uuid(),
  name: z.string(),
});

const sortKeys = schema.pick({name: true, storeId: true});

const sortable = sortKeys.keyof();
const sort = z.object({sortBy: sortable.default('name'), sortDirection: sortDirection.default('desc')});

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({name: true});

const edit = create.partial();

const addProduct = z.object({productId: z.string().uuid(), quantity: z.coerce.number().int()});
const transferProduct = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int(),
  toStoreId: z.string().uuid(),
});
const getProducts = productSchema.getAll;
const getProductsRes = productSchema.getAllRes;

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;
type SortKeys = z.infer<typeof sortKeys>;
type Sortable = z.infer<typeof sortable>;
type AddProduct = z.infer<typeof addProduct>;
type TransferProduct = z.infer<typeof transferProduct>;
type GetProducts = z.infer<typeof getProducts>;
type GetProductsRes = z.infer<typeof getProductsRes>;

export const storeWarehouseSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  sortKeys,
  sortable,
  addProduct,
  transferProduct,
  getProducts,
  getProductsRes
};

export type StoreWarehouseSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  SortKeys: SortKeys;
  Sortable: Sortable;
  AddProduct: AddProduct;
  TransferProduct: TransferProduct;
  GetProducts: GetProducts;
  GetProductsRes: GetProductsRes;
};
