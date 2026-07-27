import { QueryTypes } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { Command } from 'src/common/command/types/command.type';
import { AccountModel } from 'src/account/entities/account.entity';
import { Logger } from 'src/common/tools/pino/logger.tool';

const TABLE_COLUMNS: [string, string][] = [
  ['accounts', 'created_at'],
  ['accounts', 'updated_at'],
  ['payments', 'created_at'],
  ['payments', 'updated_at'],
  ['payments', 'paid_at'],
  ['incomes', 'created_at'],
  ['incomes', 'updated_at'],
  ['incomes', 'paid_at'],
  ['account_debts', 'created_at'],
  ['account_debts', 'updated_at'],
  ['exchanges', 'created_at'],
  ['exchanges', 'updated_at'],
  ['users', 'created_at'],
  ['users', 'updated_at'],
  ['user_relations', 'created_at'],
  ['user_relations', 'updated_at'],
  ['uncomplete_payments', 'paid_at'],
];

const OFFSET_MINUTES = 210;

export const command: Command = {
  runner: async function (appContext) {
    const logger = new Logger('correct-timestamps');
    const accountModel = appContext.get<typeof AccountModel>(
      getModelToken(AccountModel),
    );
    const sequelize = accountModel.sequelize;

    if (!sequelize) {
      return { isSuccess: false, error: 'no sequelize connection found' };
    }

    for (const [table, column] of TABLE_COLUMNS) {
      const [, affectedRows] = await sequelize.query(
        `UPDATE \`${table}\` SET \`${column}\` = DATE_ADD(\`${column}\`, INTERVAL ${OFFSET_MINUTES} MINUTE) WHERE \`${column}\` IS NOT NULL`,
        { type: QueryTypes.UPDATE },
      );

      logger.log({
        key: 'CORRECT_TIMESTAMPS',
        data: { table, column, affectedRows },
      });
    }

    return { isSuccess: true, error: null };
  },

  cmd: 'correct-timestamps',
  describe:
    'Adds the missing 3h30m Asia/Tehran offset back onto created_at/updated_at/paid_at after the TIMESTAMP->DATETIME migration and the database.module.ts timezone fix',
};
