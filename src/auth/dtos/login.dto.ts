import { z } from 'zod';

export const managerLoginDtoSchema = z
  .object({
    nationalCode: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export type ManagerLoginDto = Required<z.infer<typeof managerLoginDtoSchema>>;

export const expertLoginDtoSchema = z
  .object({
    nationalCode: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export type ExpertLoginDto = Required<z.infer<typeof expertLoginDtoSchema>>;

export const teacherLoginDtoSchema = z
  .object({
    nationalCode: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export type TeachertLoginDto = Required<z.infer<typeof teacherLoginDtoSchema>>;

export const studentLoginDtoSchema = z
  .object({
    nationalCode: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export type StudentLoginDto = Required<z.infer<typeof studentLoginDtoSchema>>;
