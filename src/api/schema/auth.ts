import { z } from 'zod';
import { user } from './user';
import { userRole } from './user-role';

export const payload = user
  .pick({ id: true })
  .extend({ roles: userRole.pick({ role: true }).array() });
export type Payload = z.infer<typeof payload>;

export const login = user.pick({ username: true, password: true });
export type Login = z.infer<typeof login>;
export const loginRes = z.object({ token: z.string() });

export const meRes = user.pick({ id: true, firstName: true, lastName: true });
