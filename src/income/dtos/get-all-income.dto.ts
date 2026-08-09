import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';

export const getAllIncomeDtoSchema = z.object({
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
  category: z.enum(IncomeCategory).optional(),
});

export type GetAllIncomeDto = z.infer<typeof getAllIncomeDtoSchema>;
