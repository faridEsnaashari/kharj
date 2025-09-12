import { z } from 'zod';

export const userLoginDtoSchema = z
  .object({
    nationalCode: z.string().min(3),
    password: z.string().min(3),
  })
  .required();

export type UserLoginDto = Required<z.infer<typeof userLoginDtoSchema>>;
