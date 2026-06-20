import { z } from 'zod';

export const updateBankDtoSchema = z.object({
  name: z.string().min(1),
  symbol: z.string().min(1).max(20),
});

export type UpdateBankDto = z.infer<typeof updateBankDtoSchema>;
