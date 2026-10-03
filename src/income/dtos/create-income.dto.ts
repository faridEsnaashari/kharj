import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { amountDtoSchema } from 'src/common/zod-schemas/amount.schema';

export const createIncomeDtoSchema = z.object({
  accountId: z.number(),
  amount: amountDtoSchema,
  category: z.enum(IncomeCategory),
  description: z.string().optional(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
  uncompletePaymentId: z.number().optional(),
});

export type CreateIncomeDto = z.infer<typeof createIncomeDtoSchema>;
