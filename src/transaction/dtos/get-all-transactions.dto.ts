import { z } from 'zod';

export const getRecentActivityDtoSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((v) => +v),
  size: z
    .string()
    .optional()
    .default('20')
    .transform((v) => +v),
});

export type GetRecentActivityDto = z.infer<typeof getRecentActivityDtoSchema>;
