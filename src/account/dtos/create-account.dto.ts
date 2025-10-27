import { nativeEnum, z } from 'zod';
import { Bank } from '../enums/bank.enum';

export const createAccountDtoSchema = z
  .object({
    ownedBy: z.number(),
    ballance: z.number(),
    bank: nativeEnum(Bank),
    priority: z.number(),
  })
  .required();

export type CreateAccountDto = Required<z.infer<typeof createAccountDtoSchema>>;
