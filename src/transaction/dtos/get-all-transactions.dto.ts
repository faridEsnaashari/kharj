import { z } from 'zod';
import { TransactionType } from '../enums/transaction-type.enum';

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
  type: z.nativeEnum(TransactionType).optional(),
});

export type GetRecentActivityDto = z.infer<typeof getRecentActivityDtoSchema>;
