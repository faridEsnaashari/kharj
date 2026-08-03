import {
  DebtGroupBy,
  DebtRow,
  DebtSummary,
  DebtSummaryRow,
  GroupedDebt,
} from './debt.logic.type';

function groupKey(
  bankId: number | null,
  unitId: number,
  fromUserId: number,
  toUserId: number,
): string {
  return `${bankId}:${unitId}:${fromUserId}:${toUserId}`;
}

function pairKey(
  bankId: number | null,
  unitId: number,
  fromUserId: number,
  toUserId: number,
): string {
  const [userA, userB] = [fromUserId, toUserId].sort((a, b) => a - b);
  return `${bankId}:${unitId}:${userA}:${userB}`;
}

export function groupDebts(
  rows: DebtRow[],
  groupBy: DebtGroupBy,
): GroupedDebt[] {
  const groups = new Map<string, GroupedDebt>();

  for (const row of rows) {
    const account = row.payment.account;
    const bankId = groupBy === 'bank' ? account.bankId : null;
    const bank = groupBy === 'bank' ? account.bank : null;
    const key = groupKey(bankId, account.unitId, row.fromUserId, row.toUserId);
    const existing = groups.get(key);

    if (existing) {
      existing.amount += row.amount;
      continue;
    }

    groups.set(key, {
      unitId: account.unitId,
      unit: account.unit,
      bankId,
      bank,
      fromUserId: row.fromUserId,
      fromUser: row.fromUser,
      toUserId: row.toUserId,
      toUser: row.toUser,
      amount: row.amount,
    });
  }

  return Array.from(groups.values());
}

export function netDebtGroups(groups: GroupedDebt[]): DebtSummaryRow[] {
  const byKey = new Map<string, GroupedDebt>();

  for (const group of groups) {
    byKey.set(
      groupKey(group.bankId, group.unitId, group.fromUserId, group.toUserId),
      group,
    );
  }

  const visitedPairs = new Set<string>();
  const result: DebtSummaryRow[] = [];

  for (const group of groups) {
    const pair = pairKey(
      group.bankId,
      group.unitId,
      group.fromUserId,
      group.toUserId,
    );

    if (visitedPairs.has(pair)) {
      continue;
    }
    visitedPairs.add(pair);

    const mirror = byKey.get(
      groupKey(group.bankId, group.unitId, group.toUserId, group.fromUserId),
    );
    const net = group.amount - (mirror?.amount || 0);

    if (net === 0) {
      continue;
    }

    const forward = net > 0;

    result.push({
      unitId: group.unitId,
      unit: group.unit,
      bankId: group.bankId,
      bank: group.bank,
      fromUserId: forward ? group.fromUserId : group.toUserId,
      fromUser: forward ? group.fromUser : group.toUser,
      toUserId: forward ? group.toUserId : group.fromUserId,
      toUser: forward ? group.toUser : group.fromUser,
      amount: Math.abs(net),
    });
  }

  return result;
}

export function buildDebtSummary(
  rows: DebtRow[],
  groupBy: DebtGroupBy,
  currentUserId: number,
): DebtSummary {
  const netted = netDebtGroups(groupDebts(rows, groupBy));
  const sortedRows = [...netted].sort((a, b) => b.amount - a.amount);

  const totals = netted.reduce(
    (acc, row) => {
      if (row.toUserId === currentUserId) {
        acc.owedToYou += row.amount;
      }
      if (row.fromUserId === currentUserId) {
        acc.youOwe += row.amount;
      }
      return acc;
    },
    { owedToYou: 0, youOwe: 0 },
  );

  return { rows: sortedRows, totals };
}
