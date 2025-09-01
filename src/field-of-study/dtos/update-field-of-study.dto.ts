import { z } from 'zod';

export const updateFieldOfStudyDtoSchema = z.object({
  name: z.string().min(3),
  code: z.number(),
  createdAt: z.string().date().optional(),
  updatedAt: z.string().date().optional(),
});

export type UpdateFieldOfStudyDto = z.infer<typeof updateFieldOfStudyDtoSchema>;
