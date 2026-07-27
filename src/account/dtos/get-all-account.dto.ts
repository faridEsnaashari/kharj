import { z } from 'zod';

export const getAllAccountsDtoSchema = z.object({
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
  ownedBy: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  bankId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  unitId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
  userId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAllAccountsDto = z.infer<typeof getAllAccountsDtoSchema>;
