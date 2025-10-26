import { z } from 'zod';
import { PaymentCategory } from '../enums/payment-category.enum';
import { Bank } from 'src/account/enums/bank.enum';

export const createPaymentDtoSchema = z.object({
  price: z.number(),
  bank: z.nativeEnum(Bank),
  category: z.nativeEnum(PaymentCategory),
  description: z.string().optional(),
  isFun: z.boolean(),
  isMaman: z.boolean(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentDtoSchema>;
