import { Account } from 'src/account/entities/account.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { groupAccountsByUnit } from './account.logic';

function buildAccount(unitId: number, ballance: number): Account {
  const unit = { id: unitId, name: 'unit-' + unitId } as Unit;

  return { unitId, unit, ballance } as Account;
}

describe('groupAccountsByUnit', () => {
  it('returns an empty list for no accounts', () => {
    expect(groupAccountsByUnit([])).toEqual([]);
  });

  it('sums balances and counts accounts per unit', () => {
    const accounts = [
      buildAccount(20, 100),
      buildAccount(20, 50),
      buildAccount(30, 7),
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
    const accounts = [buildAccount(20, 100), buildAccount(20, -30)];

    const result = groupAccountsByUnit(accounts);

    expect(result[0].total).toBe(70);
  });
});
