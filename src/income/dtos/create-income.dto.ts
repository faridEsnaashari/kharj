import { z } from 'zod';
import { IncomeCategory } from '../enums/income-category.enum';
import { Bank } from 'src/account/enums/bank.enum';

export const createIncomeDtoSchema = z.object({
  bank: z.nativeEnum(Bank),
  userId: z.number(),
  amount: z.number(),
  category: z.nativeEnum(IncomeCategory),
  description: z.string().optional(),
});

export type CreateIncomeDto = z.infer<typeof createIncomeDtoSchema>;
