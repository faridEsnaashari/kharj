import { Bank } from 'src/account/enums/bank.enum';
import { z } from 'zod';
import { dateTimeDtoSchema } from 'src/common/zod-schemas/date.schema';
import { Unit } from 'src/account/enums/unit.enum';

export const createExchangeDtoSchema = z
  .object({
    fromAccount: z.enum(Bank),
    toAccount: z.enum(Bank),
    fromUnit: z.enum(Unit),
    toUnit: z.enum(Unit),
    fromAmount: z.number(),
    toAmount: z.number(),
    fromOwner: z.number(),
    toOwner: z.number(),
    toUser: z.number(),
    paidAt: dateTimeDtoSchema.default('2020-01-01'),
  })
  .required();

export type CreateExchangeDto = Required<
  z.infer<typeof createExchangeDtoSchema>
>;
