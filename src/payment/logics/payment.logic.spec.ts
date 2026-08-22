import { Account } from 'src/account/entities/account.entity';
import {
  selectAccountsForPayment,
  sortAccounts,
  getPrice,
  restoreBalance,
  deductBalance,
  hasSufficientBalance,
} from './payment.logic';

function buildAccount(overrides: Partial<Account>): Account {
  return {
    id: 1,
    userId: 1,
    ownedBy: 1,
    ballance: 0,
    bankId: 1,
    unitId: 1,
    priority: 1,
    ...overrides,
  } as Account;
}

describe('getPrice', () => {
  it('floors the price without scaling it', () => {
    expect(getPrice(150000)).toBe(150000);
    expect(getPrice(154999.9)).toBe(154999);
    expect(getPrice(0)).toBe(0);
  });
});

describe('sortAccounts', () => {
  it('moves the target user account to the front', () => {
    const accounts = [
      buildAccount({ id: 1, ownedBy: 10 }),
      buildAccount({ id: 2, ownedBy: 20 }),
      buildAccount({ id: 3, ownedBy: 30 }),
    ];

    const result = sortAccounts(accounts, 20);

    expect(result.map((a) => a.id)).toEqual([2, 1, 3]);
  });
});

describe('selectAccountsForPayment', () => {
  it('covers the full price from a single account', () => {
    const accounts = [buildAccount({ id: 1, ballance: 500 })];

    const { selectedAccounts, remain } = selectAccountsForPayment(
      accounts,
      200,
    );

    expect(remain).toBe(0);
    expect(selectedAccounts).toHaveLength(1);
    expect(selectedAccounts[0].minus).toBe(200);
    expect(selectedAccounts[0].ballance).toBe(300);
  });

  it('spills over into the next account when the first is insufficient', () => {
    const accounts = [
      buildAccount({ id: 1, ballance: 100 }),
      buildAccount({ id: 2, ballance: 500 }),
    ];

    const { selectedAccounts, remain } = selectAccountsForPayment(
      accounts,
      300,
    );

    expect(remain).toBe(0);
    expect(selectedAccounts).toHaveLength(2);
    expect(selectedAccounts[0].minus).toBe(100);
    expect(selectedAccounts[0].ballance).toBe(0);
    expect(selectedAccounts[1].minus).toBe(200);
    expect(selectedAccounts[1].ballance).toBe(300);
  });

  it('returns a positive remain when total funds are insufficient', () => {
    const accounts = [buildAccount({ id: 1, ballance: 50 })];

    const { remain } = selectAccountsForPayment(accounts, 300);

    expect(remain).toBe(250);
  });

  it('skips accounts with zero or negative balance without deducting', () => {
    const accounts = [
      buildAccount({ id: 1, ballance: -10 }),
      buildAccount({ id: 2, ballance: 500 }),
    ];

    const { selectedAccounts, remain } = selectAccountsForPayment(
      accounts,
      200,
    );

    expect(remain).toBe(0);
    expect(selectedAccounts[0].minus).toBe(0);
    expect(selectedAccounts[0].ballance).toBe(-10);
    expect(selectedAccounts[1].minus).toBe(200);
  });

  it('stops once the price is fully covered, leaving later accounts untouched', () => {
    const accounts = [
      buildAccount({ id: 1, ballance: 500 }),
      buildAccount({ id: 2, ballance: 500 }),
    ];

    const { selectedAccounts } = selectAccountsForPayment(accounts, 100);

    expect(selectedAccounts).toHaveLength(1);
    expect(selectedAccounts[0].id).toBe(1);
  });
});

describe('restoreBalance', () => {
  it('adds the originally paid amount back to the balance', () => {
    expect(restoreBalance(300, 100)).toBe(400);
  });

  it('works with a zero paid amount', () => {
    expect(restoreBalance(300, 0)).toBe(300);
  });
});

describe('deductBalance', () => {
  it('subtracts the new amount from the restored balance', () => {
    expect(deductBalance(400, 250)).toBe(150);
  });

  it('can consume the whole balance', () => {
    expect(deductBalance(400, 400)).toBe(0);
  });
});

describe('hasSufficientBalance', () => {
  it('accepts when the balance covers the amount exactly', () => {
    expect(hasSufficientBalance(400, 400)).toBe(true);
  });

  it('accepts when the balance exceeds the amount', () => {
    expect(hasSufficientBalance(400, 100)).toBe(true);
  });

  it('rejects when the balance falls short', () => {
    expect(hasSufficientBalance(399, 400)).toBe(false);
  });
});
