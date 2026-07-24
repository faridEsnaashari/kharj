import { Account } from 'src/account/entities/account.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import {
  groupAccountsByUnit,
  sumWeeklyPaymentIncomeByUnit,
} from './account.logic';

function buildAccount(id: number, unitId: number, ballance: number): Account {
  const unit = { id: unitId, name: 'unit-' + unitId } as Unit;

  return { id, unitId, unit, ballance } as Account;
}

function buildPayment(accountId: number, amount: number): Payment {
  return { accountId, amount } as Payment;
}

function buildIncome(accountId: number, amount: number): Income {
  return { accountId, amount } as Income;
}

describe('groupAccountsByUnit', () => {
  it('returns an empty list for no accounts', () => {
    expect(groupAccountsByUnit([])).toEqual([]);
  });

  it('sums balances and counts accounts per unit', () => {
    const accounts = [
      buildAccount(1, 20, 100),
      buildAccount(2, 20, 50),
      buildAccount(3, 30, 7),
    ];

    const result = groupAccountsByUnit(accounts);

    expect(result).toHaveLength(2);
    expect(result).toContainEqual({
      unitId: 20,
      unit: accounts[0].unit,
      total: 150,
      accountCount: 2,
    });
    expect(result).toContainEqual({
      unitId: 30,
      unit: accounts[2].unit,
      total: 7,
      accountCount: 1,
    });
  });

  it('keeps negative balances in the total', () => {
    const accounts = [buildAccount(1, 20, 100), buildAccount(2, 20, -30)];

    const result = groupAccountsByUnit(accounts);

    expect(result[0].total).toBe(70);
  });

  it('sorts the result by total balance descending', () => {
    const accounts = [
      buildAccount(1, 20, 7),
      buildAccount(2, 30, 150),
      buildAccount(3, 40, 50),
    ];

    const result = groupAccountsByUnit(accounts);

    expect(result.map((r) => r.unitId)).toEqual([30, 40, 20]);
  });
});

describe('sumWeeklyPaymentIncomeByUnit', () => {
  it('returns an empty list for no accounts', () => {
    expect(sumWeeklyPaymentIncomeByUnit([], [], [])).toEqual([]);
  });

  it('seeds every account unit with zero totals even without activity', () => {
    const accounts = [buildAccount(1, 20, 100), buildAccount(2, 30, 7)];

    const result = sumWeeklyPaymentIncomeByUnit(accounts, [], []);

    expect(result).toContainEqual({
      unitId: 20,
      weeklyIncome: 0,
      weeklyPayment: 0,
    });
    expect(result).toContainEqual({
      unitId: 30,
      weeklyIncome: 0,
      weeklyPayment: 0,
    });
  });

  it('sums payments and incomes onto the unit their account belongs to', () => {
    const accounts = [
      buildAccount(1, 20, 100),
      buildAccount(2, 20, 50),
      buildAccount(3, 30, 7),
    ];
    const payments = [buildPayment(1, 10), buildPayment(2, 5), buildPayment(3, 2)];
    const incomes = [buildIncome(1, 40), buildIncome(3, 3)];

    const result = sumWeeklyPaymentIncomeByUnit(accounts, payments, incomes);

    const unit20 = result.find((r) => r.unitId === 20);
    const unit30 = result.find((r) => r.unitId === 30);

    expect(unit20).toEqual({ unitId: 20, weeklyIncome: 40, weeklyPayment: 15 });
    expect(unit30).toEqual({ unitId: 30, weeklyIncome: 3, weeklyPayment: 2 });
  });
});
