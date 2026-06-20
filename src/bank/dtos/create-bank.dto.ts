import { z } from 'zod';

export const createBankDtoSchema = z.object({
  name: z.string().min(1),
  symbol: z.string().min(1).max(20),
});

export type CreateBankDto = z.infer<typeof createBankDtoSchema>;
