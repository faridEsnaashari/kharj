import { z } from 'zod';
import { amountDtoSchema } from 'src/common/zod-schemas/amount.schema';

export const createAccountDtoSchema = z
  .object({
    ownedBy: z.number(),
    ballance: amountDtoSchema,
    bankId: z.number(),
    unitId: z.number(),
    priority: z.number(),
  })
  .required();

export type CreateAccountDto = Required<z.infer<typeof createAccountDtoSchema>>;
