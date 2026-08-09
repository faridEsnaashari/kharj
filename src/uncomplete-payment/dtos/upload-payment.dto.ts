import { z } from 'zod';

export const uploadPaymentDtoSchema = z.object({
  bankId: z.number(),
  uploadedFile: z.string(),
});

export type UploadPaymentDto = z.infer<typeof uploadPaymentDtoSchema>;
