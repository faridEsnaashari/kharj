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
  bankId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  unitId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  ownedBy: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetRecentActivityDto = z.infer<typeof getRecentActivityDtoSchema>;
