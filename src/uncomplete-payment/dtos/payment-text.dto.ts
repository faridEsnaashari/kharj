import { z } from 'zod';
import { Bank } from 'src/account/enums/bank.enum';

export const PaymentTextDtoSchema = z.object({
  bank: z.enum(Bank),
  text: z.string(),
});

export type PaymentTextDto = z.infer<typeof PaymentTextDtoSchema>;
