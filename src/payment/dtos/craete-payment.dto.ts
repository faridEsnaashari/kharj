import { z } from 'zod';
import { PaymentCategory } from '../enums/payment-category.enum';
import { Bank } from 'src/account/enums/bank.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';

export const createPaymentDtoSchema = z.object({
  price: z.number(),
  bank: z.enum(Bank),
  category: z.enum(PaymentCategory),
  description: z.string().optional(),
  isFun: z.boolean(),
  isMaman: z.boolean(),
  ownerId: z.number(),
  paidAt: dateTimeDtoSchema,
});

export type CreatePaymentDto = z.infer<typeof createPaymentDtoSchema>;
