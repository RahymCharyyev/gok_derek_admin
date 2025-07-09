import {z} from 'zod';
import {user} from './user';

export const payload = user.pick({id: true, role: true});
export type Payload = z.infer<typeof payload>;

export const login = user.pick({username: true, password: true});
export type Login = z.infer<typeof login>;
export const loginRes = z.object({token: z.string()});

export const meRes = user.pick({id: true, firstName: true, lastName: true, role: true});
