import { z } from 'zod';

export const findAllManagerDtoSchema = z.preprocess(
  (value) => JSON.parse(JSON.stringify(value)),
  z
    .object({
      q: z.string().min(3).optional(),

      birthOfDate: z.string().date().optional(),

      gender: z.literal('MALE').or(z.literal('FEMALE')).optional(),

      page: z
        .string()
        .optional()
        .transform((val) => val && +val),

      limit: z
        .string()
        .optional()
        .transform((val) => val && +val),
    })
    .transform((value) => ({ page: 1, limit: 10, ...value })),
);

export type FindAllManagerDto = z.infer<typeof findAllManagerDtoSchema>;
