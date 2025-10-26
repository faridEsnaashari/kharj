import { Bank } from 'src/account/enums/bank.enum';
import { z } from 'zod';

export const createExchangeDtoSchema = z
  .object({
    fromAccount: z.nativeEnum(Bank),
    toAccount: z.nativeEnum(Bank),
    amount: z.number(),
    fromOwner: z.number(),
    toOwner: z.number(),
  })
  .required();

export type CreateExchangeDto = Required<
  z.infer<typeof createExchangeDtoSchema>
>;
