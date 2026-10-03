import { z } from 'zod';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { amountDtoSchema } from 'src/common/zod-schemas/amount.schema';

export const createExchangeDtoSchema = z
  .object({
    fromAccountId: z.number(),
    toAccountId: z.number(),
    fromAmount: amountDtoSchema,
    toAmount: amountDtoSchema,
    toUser: z.number(),
    paidAt: dateTimeDtoSchema.default('2020-01-01'),
    uncompletePaymentId: z.number().optional(),
  })
  .required({
    fromAccountId: true,
    toAccountId: true,
    fromAmount: true,
    toAmount: true,
    toUser: true,
    paidAt: true,
  });

export type CreateExchangeDto = z.infer<typeof createExchangeDtoSchema>;
