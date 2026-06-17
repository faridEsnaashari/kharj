import z from 'zod';

export const idDtoSchema = z
  .stringFormat('id-dto', (v) => typeof +v === 'number' && +v > 0)
  .transform((v) => v as unknown as number);

export type IdDto = z.infer<typeof idDtoSchema>;
