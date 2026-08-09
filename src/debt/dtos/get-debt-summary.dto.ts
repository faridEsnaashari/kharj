import { z } from 'zod';

export const getDebtSummaryDtoSchema = z.object({
  groupBy: z.enum(['bank', 'unit']).optional().default('bank'),
  bankId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  unitId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetDebtSummaryDto = z.infer<typeof getDebtSummaryDtoSchema>;
