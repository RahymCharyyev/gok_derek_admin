import {z} from 'zod';
import {commonQuery, sortDirection} from './common';

const schema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const sortable = schema.pick({name: true}).keyof();

const sort = z.object({sortBy: sortable.default('name'), sortDirection: sortDirection.default('desc')}).partial();

const getAll = schema.partial().merge(sort).merge(commonQuery);
const getAllRes = z.object({
  count: z.number(),
  data: schema.array(),
});

const getOneRes = schema;

const create = schema.pick({name: true});

const edit = create.partial();

type Schema = z.infer<typeof schema>;
type GetAll = z.infer<typeof getAll>;
type Create = z.infer<typeof create>;
type Edit = z.infer<typeof edit>;

export const locationSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
};

export type LocationSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
};
