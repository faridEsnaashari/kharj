import { Account } from 'src/account/entities/account.entity';
import { Unit } from 'src/unit/entities/unit.entity';

export type AccountStatisticItem = {
  unitId: number;
  unit: Unit;
  total: number;
  accountCount: number;
};

export function groupAccountsByUnit(
  accounts: Account[],
): AccountStatisticItem[] {
  const grouped = accounts.reduce<Record<number, AccountStatisticItem>>(
    (acc, account) => {
      const { unitId } = account;

      if (!acc[unitId]) {
        acc[unitId] = {
          unitId,
          unit: account.unit,
          total: 0,
          accountCount: 0,
        };
      }

      acc[unitId].total += account.ballance;
      acc[unitId].accountCount += 1;

      return acc;
    },
    {},
  );

  return Object.values(grouped);
}
