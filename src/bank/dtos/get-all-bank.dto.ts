import { z } from 'zod';

export const getAllBankDtoSchema = z.object({
  userId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAllBankDto = z.infer<typeof getAllBankDtoSchema>;
