import { Bank } from 'src/account/enums/bank.enum';
import { z } from 'zod';

export const getAllPaymentsDtoSchema = z.object({
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
  bank: z.nativeEnum(Bank).optional(),
});

export type GetAllPaymentsDto = z.infer<typeof getAllPaymentsDtoSchema>;
