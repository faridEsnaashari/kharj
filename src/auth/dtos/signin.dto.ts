import { z } from 'zod';

export const signinDtoSchema = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .required();

export type SigninDto = Required<z.infer<typeof signinDtoSchema>>;
