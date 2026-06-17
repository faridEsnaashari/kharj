import { idDtoSchema } from 'src/common/zod-schemas/id.schema';
import { z } from 'zod';

export const deleteUncompletePaymentsDtoSchema = z.object({
  id: idDtoSchema,
});

export type DeleteUncompletePaymentsDto = z.infer<
  typeof deleteUncompletePaymentsDtoSchema
>;
