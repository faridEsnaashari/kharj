import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';

export const updateIncomeDtoSchema = z.object({
  amount: z.number(),
  category: z.enum(IncomeCategory),
  description: z.string().optional(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
});

export type UpdateIncomeDto = z.infer<typeof updateIncomeDtoSchema>;
