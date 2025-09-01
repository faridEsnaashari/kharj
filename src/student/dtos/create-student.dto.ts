import { z } from 'zod';

export const createStudentDtoSchema = z.object({}).required();

export type CreateStudentDto = Required<z.infer<typeof createStudentDtoSchema>>;
