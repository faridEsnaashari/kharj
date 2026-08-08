import { QueryTypes } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { Command } from 'src/common/command/types/command.type';
import { IncomeModel } from '../entities/income.entity';
import { Logger } from 'src/common/tools/pino/logger.tool';

export const command: Command = {
  runner: async function (appContext) {
    const logger = new Logger('fill-income-paid-at');
    const incomeModel = appContext.get<typeof IncomeModel>(
      getModelToken(IncomeModel),
    );
    const sequelize = incomeModel.sequelize;

    if (!sequelize) {
      return { isSuccess: false, error: 'no sequelize connection found' };
    }

    const [, affectedRows] = await sequelize.query(
      'UPDATE `incomes` SET `paid_at` = `created_at` WHERE `paid_at` IS NULL',
      { type: QueryTypes.UPDATE },
    );

    logger.log({
      key: 'FILL_INCOME_PAID_AT',
      data: { table: 'incomes', affectedRows },
    });

    return { isSuccess: true, error: null };
  },

  cmd: 'fill-income-paid-at',
  describe:
    'Sets paid_at = created_at for every income row where paid_at is null',
};
