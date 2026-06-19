import { z } from 'zod';

export const updateUnitDtoSchema = z
  .object({
    name: z.string().min(1),
    symbol: z.string().min(1).max(20),
  })
  .required();

export type UpdateUnitDto = z.infer<typeof updateUnitDtoSchema>;
