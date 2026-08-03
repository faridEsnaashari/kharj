import { buildDebtSummary, groupDebts, netDebtGroups } from './debt.logic';
import { DebtRow } from './debt.logic.type';

const bank = { id: 1, name: 'Bank', symbol: 'B' };
const otherBank = { id: 2, name: 'Other Bank', symbol: 'OB' };
const unit = { id: 10, name: 'Unit', symbol: 'U' };
const alice = { id: 1, name: 'Alice' };
const bob = { id: 2, name: 'Bob' };

function debtRow(overrides: Partial<DebtRow> = {}): DebtRow {
  return {
    amount: 100,
    fromUserId: alice.id,
    fromUser: alice,
    toUserId: bob.id,
    toUser: bob,
    payment: {
      account: {
        bankId: bank.id,
        bank,
        unitId: unit.id,
        unit,
      },
    },
    ...overrides,
  };
}

describe('debt.logic', () => {
  describe('groupDebts', () => {
    it('sums amounts for rows sharing bank, unit and direction', () => {
      const rows = [debtRow({ amount: 40 }), debtRow({ amount: 60 })];

      const grouped = groupDebts(rows, 'bank');

      expect(grouped).toHaveLength(1);
      expect(grouped[0].amount).toBe(100);
    });

    it('keeps different banks separate when grouping by bank', () => {
      const rows = [
        debtRow({ amount: 40 }),
        debtRow({
          amount: 60,
          payment: {
            account: {
              bankId: otherBank.id,
              bank: otherBank,
              unitId: unit.id,
              unit,
            },
          },
        }),
      ];

      const grouped = groupDebts(rows, 'bank');

      expect(grouped).toHaveLength(2);
    });

    it('collapses different banks into one group when grouping by unit', () => {
      const rows = [
        debtRow({ amount: 40 }),
        debtRow({
          amount: 60,
          payment: {
            account: {
              bankId: otherBank.id,
              bank: otherBank,
              unitId: unit.id,
              unit,
            },
          },
        }),
      ];

      const grouped = groupDebts(rows, 'unit');

      expect(grouped).toHaveLength(1);
      expect(grouped[0].amount).toBe(100);
      expect(grouped[0].bankId).toBeNull();
    });
  });

  describe('netDebtGroups', () => {
    it('nets a group against its reverse-direction mirror', () => {
      const grouped = groupDebts(
        [
          debtRow({
            amount: 100,
            fromUserId: alice.id,
            fromUser: alice,
            toUserId: bob.id,
            toUser: bob,
          }),
          debtRow({
            amount: 30,
            fromUserId: bob.id,
            fromUser: bob,
            toUserId: alice.id,
            toUser: alice,
          }),
        ],
        'bank',
      );

      const netted = netDebtGroups(grouped);

      expect(netted).toHaveLength(1);
      expect(netted[0]).toMatchObject({
        fromUserId: alice.id,
        toUserId: bob.id,
        amount: 70,
      });
    });

    it('flips direction when the reverse debt is larger', () => {
      const grouped = groupDebts(
        [
          debtRow({
            amount: 20,
            fromUserId: alice.id,
            fromUser: alice,
            toUserId: bob.id,
            toUser: bob,
          }),
          debtRow({
            amount: 50,
            fromUserId: bob.id,
            fromUser: bob,
            toUserId: alice.id,
            toUser: alice,
          }),
        ],
        'bank',
      );

      const netted = netDebtGroups(grouped);

      expect(netted).toHaveLength(1);
      expect(netted[0]).toMatchObject({
        fromUserId: bob.id,
        toUserId: alice.id,
        amount: 30,
      });
    });

    it('drops the pair entirely when both directions cancel out', () => {
      const grouped = groupDebts(
        [
          debtRow({
            amount: 50,
            fromUserId: alice.id,
            fromUser: alice,
            toUserId: bob.id,
            toUser: bob,
          }),
          debtRow({
            amount: 50,
            fromUserId: bob.id,
            fromUser: bob,
            toUserId: alice.id,
            toUser: alice,
          }),
        ],
        'bank',
      );

      expect(netDebtGroups(grouped)).toHaveLength(0);
    });

    it('does not emit the same pair twice', () => {
      const grouped = groupDebts(
        [
          debtRow({
            amount: 100,
            fromUserId: alice.id,
            fromUser: alice,
            toUserId: bob.id,
            toUser: bob,
          }),
          debtRow({
            amount: 30,
            fromUserId: bob.id,
            fromUser: bob,
            toUserId: alice.id,
            toUser: alice,
          }),
        ],
        'bank',
      );

      expect(netDebtGroups(grouped)).toHaveLength(1);
    });
  });

  describe('buildDebtSummary', () => {
    it('computes owedToYou and youOwe totals from the current user perspective', () => {
      const rows = [
        debtRow({
          amount: 100,
          fromUserId: bob.id,
          fromUser: bob,
          toUserId: alice.id,
          toUser: alice,
        }),
        debtRow({
          amount: 40,
          fromUserId: alice.id,
          fromUser: alice,
          toUserId: bob.id,
          toUser: bob,
          payment: {
            account: {
              bankId: otherBank.id,
              bank: otherBank,
              unitId: unit.id,
              unit,
            },
          },
        }),
      ];

      const summary = buildDebtSummary(rows, 'bank', alice.id);

      expect(summary.totals).toEqual({ owedToYou: 100, youOwe: 40 });
      expect(summary.rows).toHaveLength(2);
    });

    it('sorts rows by amount descending', () => {
      const rows = [
        debtRow({
          amount: 10,
          toUserId: alice.id,
          toUser: alice,
          fromUserId: bob.id,
          fromUser: bob,
        }),
        debtRow({
          amount: 90,
          toUserId: alice.id,
          toUser: alice,
          fromUserId: bob.id,
          fromUser: bob,
          payment: {
            account: {
              bankId: otherBank.id,
              bank: otherBank,
              unitId: unit.id,
              unit,
            },
          },
        }),
      ];

      const summary = buildDebtSummary(rows, 'bank', alice.id);

      expect(summary.rows.map((row) => row.amount)).toEqual([90, 10]);
    });
  });
});
