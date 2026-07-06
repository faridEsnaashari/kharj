import { z } from 'zod';

export const getAllDebtDtoSchema = z.object({
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
  fromUserId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  toUserId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAllDebtDto = z.infer<typeof getAllDebtDtoSchema>;
