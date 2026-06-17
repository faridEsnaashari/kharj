import { Command } from 'src/common/command/types/command.type';
import { UncompletePaymentRepository } from '../entities/repositories/uncomplete-payment.repository';
import { UncompletePaymentType } from '../enums/uncomplete-payment-type.enum';

export const command: Command = {
  runner: async function (appContext) {
    const unRep = appContext.get(UncompletePaymentRepository);

    await unRep.update({ type: UncompletePaymentType.PAYMENT }, {});

    return {
      isSuccess: true,
      error: null,
    };
  },

  cmd: 'fill-type',
  describe: 'fill types of uncomplete payments',
};
