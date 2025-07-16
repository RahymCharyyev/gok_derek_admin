import {z} from 'zod';

export const role = z.enum(['admin', 'seller', 'accountant', 'store', 'furniture']);
export type Role = z.infer<typeof role>;

export const userRole = z.object({userId: z.string().uuid(), role});
export type UserRole = z.infer<typeof userRole>;
