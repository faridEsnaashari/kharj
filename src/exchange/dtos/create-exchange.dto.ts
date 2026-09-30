import { z } from 'zod';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';

export const createExchangeDtoSchema = z
  .object({
    fromAccountId: z.number(),
    toAccountId: z.number(),
    fromAmount: z.number(),
    toAmount: z.number(),
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
