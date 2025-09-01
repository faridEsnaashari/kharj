import { z } from 'zod';

export const createTeacherDtoSchema = z
  .object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    phone: z.string().min(3),
    nationalCode: z.string().min(3),
    birthOfDate: z.string().date(),
    fatherName: z.string().min(3),
    password: z.string().min(3),
    gender: z.literal('MALE').or(z.literal('FEMALE')),
  })
  .required();

export type CreateTeacherDto = Required<z.infer<typeof createTeacherDtoSchema>>;
