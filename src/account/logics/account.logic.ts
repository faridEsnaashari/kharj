import { Account } from 'src/account/entities/account.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';

export type AccountStatisticItem = {
  unitId: number;
  unit: Unit;
  total: number;
  accountCount: number;
};

export type AccountWeeklyStatisticItem = {
  unitId: number;
  weeklyIncome: number;
  weeklyPayment: number;
};

function groupAccountsByUnitId(accounts: Account[]): Record<number, Account[]> {
  return accounts.reduce<Record<number, Account[]>>((acc, account) => {
    const unitAccounts = acc[account.unitId] ?? [];
    acc[account.unitId] = [...unitAccounts, account];

    return acc;
  }, {});
}

export function groupAccountsByUnit(
  accounts: Account[],
): AccountStatisticItem[] {
  const accountsByUnitId = groupAccountsByUnitId(accounts);

  const items = Object.values(accountsByUnitId).map((unitAccounts) => ({
    unitId: unitAccounts[0].unitId,
    unit: unitAccounts[0].unit,
    total: unitAccounts.reduce((sum, account) => sum + account.ballance, 0),
    accountCount: unitAccounts.length,
  }));

  return items.sort((a, b) => b.total - a.total);
}

export function sumWeeklyPaymentIncomeByUnit(
  accounts: Account[],
  payments: Payment[],
  incomes: Income[],
): AccountWeeklyStatisticItem[] {
  const accountsByUnitId = groupAccountsByUnitId(accounts);
  const unitIdByAccountId = Object.fromEntries(
    accounts.map((account) => [account.id, account.unitId]),
  );

  const items: Record<number, AccountWeeklyStatisticItem> = {};

  Object.keys(accountsByUnitId).forEach((unitIdKey) => {
    const unitId = +unitIdKey;
    items[unitId] = { unitId, weeklyIncome: 0, weeklyPayment: 0 };
  });

  payments.forEach((payment) => {
    const unitId = unitIdByAccountId[payment.accountId];
    items[unitId].weeklyPayment += payment.amount;
  });

  incomes.forEach((income) => {
    const unitId = unitIdByAccountId[income.accountId];
    items[unitId].weeklyIncome += income.amount;
  });

  return Object.values(items);
}
