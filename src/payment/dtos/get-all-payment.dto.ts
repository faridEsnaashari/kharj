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
  bankId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAllPaymentsDto = z.infer<typeof getAllPaymentsDtoSchema>;
