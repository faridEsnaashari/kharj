import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';

export const createIncomeDtoSchema = z.object({
  accountId: z.number(),
  amount: z.number(),
  category: z.enum(IncomeCategory),
  description: z.string().optional(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
  uncompletePaymentId: z.number().optional(),
});

export type CreateIncomeDto = z.infer<typeof createIncomeDtoSchema>;
