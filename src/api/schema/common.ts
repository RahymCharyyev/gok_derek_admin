import {z} from 'zod';

export const commonQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().max(100).default(20),
});

export type CommonQuery = z.infer<typeof commonQuery>;

export const limitOffset = (d: CommonQuery) => ({
  offset: (d.page - 1) * d.perPage,
  limit: d.perPage,
});
export type LimitOffset = {limit: number; offset: number};

export const result = z.object({success: z.boolean()});

export const sortDirection = z.enum(['asc', 'desc']);