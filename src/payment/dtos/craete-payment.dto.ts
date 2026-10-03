import { z } from 'zod';
import { PaymentCategory } from '../enums/payment-category.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { amountDtoSchema } from 'src/common/zod-schemas/amount.schema';

export const createPaymentDtoSchema = z.object({
  price: amountDtoSchema,
  bankId: z.number(),
  category: z.enum(PaymentCategory),
  description: z.string().optional(),
  isFun: z.boolean(),
  isMaman: z.boolean(),
  ownerId: z.number(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
  uncompletePaymentId: z.number().optional(),
  unitId: z.number(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentDtoSchema>;
