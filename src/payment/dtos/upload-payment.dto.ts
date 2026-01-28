import { z } from 'zod';
import { Bank } from 'src/account/enums/bank.enum';

export const uploadPaymentDtoSchema = z.object({
  bank: z.enum(Bank),
  uploadedFile: z.string(),
});

export type UploadPaymentDto = z.infer<typeof uploadPaymentDtoSchema>;
