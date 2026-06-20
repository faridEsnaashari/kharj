import { z } from 'zod';

export const getAllUncompletePaymentsDtoSchema = z.object({
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

  bankId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAllUncompletePaymentsDto = z.infer<
  typeof getAllUncompletePaymentsDtoSchema
>;
