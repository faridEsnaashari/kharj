import { z } from 'zod';

export const uploadDtoSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.unknown(),
  size: z.number(),
});

export type UploadDto = z.infer<typeof uploadDtoSchema>;
