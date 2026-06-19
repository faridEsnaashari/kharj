import { z } from 'zod';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';

export const createExchangeDtoSchema = z
  .object({
    fromAccountId: z.number(),
    toAccountId: z.number(),
    fromAmount: z.number(),
    toAmount: z.number(),
    paidAt: dateTimeDtoSchema.default('2020-01-01'),
  })
  .required();

export type CreateExchangeDto = Required<
  z.infer<typeof createExchangeDtoSchema>
>;
