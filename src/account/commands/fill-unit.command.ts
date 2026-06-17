import { Command } from 'src/common/command/types/command.type';
import { AccountRepository } from '../entities/repositories/account.repository';
import { Unit } from '../enums/unit.enum';

export const command: Command = {
  runner: async function (appContext) {
    const accRep = appContext.get(AccountRepository);

    await accRep.update({ unit: Unit.RIAL }, {});

    return {
      isSuccess: true,
      error: null,
    };
  },

  cmd: 'fill-unit',
  describe: 'fill types of uncomplete payments',
};
