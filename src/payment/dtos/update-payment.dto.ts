import { z } from 'zod';
import { PaymentCategory } from '../enums/payment-category.enum';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { amountDtoSchema } from 'src/common/zod-schemas/amount.schema';

export const updatePaymentDtoSchema = z.object({
  price: amountDtoSchema,
  category: z.enum(PaymentCategory),
  description: z.string().optional(),
  isFun: z.boolean(),
  isMaman: z.boolean(),
  paidAt: dateTimeDtoSchema.default('2020-01-01'),
});

export type UpdatePaymentDto = z.infer<typeof updatePaymentDtoSchema>;
