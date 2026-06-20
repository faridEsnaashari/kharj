import { z } from 'zod';

export const PaymentTextDtoSchema = z.object({
  bankId: z.number(),
  text: z.string(),
});

export type PaymentTextDto = z.infer<typeof PaymentTextDtoSchema>;
