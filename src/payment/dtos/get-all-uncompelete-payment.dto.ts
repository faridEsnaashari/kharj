import { Bank } from 'src/account/enums/bank.enum';
import { z } from 'zod';

export const getAllUncompeletePaymentsDtoSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((v) => +v),
  size: z
    .string()
    .optional()
    .default('20')
    .transform((v) => +v),

  bank: z.enum(Bank).optional(),
});

export type GetAllUncompeletePaymentsDto = z.infer<
  typeof getAllUncompeletePaymentsDtoSchema
>;
