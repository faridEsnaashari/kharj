import { z } from 'zod';

export const createAccountDtoSchema = z
  .object({
    ownedBy: z.number(),
    ballance: z.number(),
    bankId: z.number(),
    unitId: z.number(),
    priority: z.number(),
  })
  .required();

export type CreateAccountDto = Required<z.infer<typeof createAccountDtoSchema>>;
