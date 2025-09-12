import { z } from 'zod';

export const createUserDtoSchema = z.object({}).required();

export type CreateUserDto = Required<z.infer<typeof createUserDtoSchema>>;
