import { QueryTypes } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { Command } from 'src/common/command/types/command.type';
import { PaymentModel } from '../entities/payment.entity';
import { Logger } from 'src/common/tools/pino/logger.tool';

export const command: Command = {
  runner: async function (appContext) {
    const logger = new Logger('fill-payment-paid-at');
    const paymentModel = appContext.get<typeof PaymentModel>(
      getModelToken(PaymentModel),
    );
    const sequelize = paymentModel.sequelize;

    if (!sequelize) {
      return { isSuccess: false, error: 'no sequelize connection found' };
    }

    const [, affectedRows] = await sequelize.query(
      'UPDATE `payments` SET `paid_at` = `created_at` WHERE `paid_at` IS NULL',
      { type: QueryTypes.UPDATE },
    );

    logger.log({
      key: 'FILL_PAYMENT_PAID_AT',
      data: { table: 'payments', affectedRows },
    });

    return { isSuccess: true, error: null };
  },

  cmd: 'fill-payment-paid-at',
  describe:
    'Sets paid_at = created_at for every payment row where paid_at is null',
};
