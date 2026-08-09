import { z } from 'zod';

export const getAccountStatisticDtoSchema = z.object({
  unitId: z
    .string()
    .optional()
    .transform((v) => (v ? +v : undefined)),
});

export type GetAccountStatisticDto = z.infer<
  typeof getAccountStatisticDtoSchema
>;
