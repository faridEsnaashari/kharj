import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { amountDtoSchema } from 'src/common/zod-schemas/amount.schema';

export const updateIncomeDtoSchema = z.object({
  amount: amountDtoSchema,
  category: z.enum(IncomeCategory),
  description: z.string().optional(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
});

export type UpdateIncomeDto = z.infer<typeof updateIncomeDtoSchema>;
