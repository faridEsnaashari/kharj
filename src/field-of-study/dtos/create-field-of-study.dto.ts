import { z } from 'zod';

export const createFieldOfStudyDtoSchema = z
  .object({
    name: z.string().min(3),
    code: z.number(),
  })
  .required();

export type CreateFieldOfStudyDto = Required<
  z.infer<typeof createFieldOfStudyDtoSchema>
>;
