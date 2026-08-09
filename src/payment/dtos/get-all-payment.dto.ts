import { z } from 'zod';
import { PaymentCategory } from '../enums/payment-category.enum';

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
  unitId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  ownedBy: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  category: z.enum(PaymentCategory).optional(),
});

export type GetAllPaymentsDto = z.infer<typeof getAllPaymentsDtoSchema>;
