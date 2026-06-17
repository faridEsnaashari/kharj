import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';
import { Bank } from 'src/account/enums/bank.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { Unit } from 'src/account/enums/unit.enum';

export const createIncomeDtoSchema = z.object({
  bank: z.enum(Bank),
  userId: z.number(),
  amount: z.number(),
  category: z.enum(IncomeCategory),
  description: z.string().optional(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
  uncompletePaymentId: z.number().optional(),
  unit: z.enum(Unit),
});

export type CreateIncomeDto = z.infer<typeof createIncomeDtoSchema>;
