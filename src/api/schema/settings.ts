import {z} from 'zod';
import {commonQuery} from './common';

export const settings = z.object({
  key: z.enum(['dollar', 'loginStart', 'loginEnd']),
  value: z.string(),
  type: z.enum(['string', 'number', 'date', 'time']),
});
export type Settings = z.infer<typeof settings>;

export const settingsAdd = settings.pick({key: true, value: true, type: true});
export type SettingsAdd = z.infer<typeof settingsAdd>;

export const settingsEdit = settings.pick({key: true, value: true, type: true}).partial();
export type SettingsEdit = z.infer<typeof settingsEdit>;

export const settingsGetAll = settings.pick({key: true, type: true}).partial().merge(commonQuery);
export const settingsGetAllRes = z.object({count: z.number(), data: settings.array()});
export type SettingsGetAll = z.infer<typeof settingsGetAll>;
