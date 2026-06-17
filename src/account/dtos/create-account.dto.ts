import { z } from 'zod';
import { Bank } from '../enums/bank.enum';
import { Unit } from '../enums/unit.enum';

export const createAccountDtoSchema = z
  .object({
    ownedBy: z.number(),
    ballance: z.number(),
    bank: z.enum(Bank),
    unit: z.enum(Unit),
    priority: z.number(),
  })
  .required();

export type CreateAccountDto = Required<z.infer<typeof createAccountDtoSchema>>;
