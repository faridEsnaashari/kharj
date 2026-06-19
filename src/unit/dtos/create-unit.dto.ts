import { z } from 'zod';

export const createUnitDtoSchema = z
  .object({
    name: z.string().min(1),
    symbol: z.string().min(1).max(20),
  })
  .required();

export type CreateUnitDto = Required<z.infer<typeof createUnitDtoSchema>>;
