import { z } from 'zod';

export const getAllUnitDtoSchema = z.object({
  userId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAllUnitDto = z.infer<typeof getAllUnitDtoSchema>;
