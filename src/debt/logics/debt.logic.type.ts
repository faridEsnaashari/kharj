export type DebtRow = {
  amount: number;
  fromUserId: number;
  fromUser: { id: number; name: string };
  toUserId: number;
  toUser: { id: number; name: string };
  payment: {
    account: {
      bankId: number;
      bank: { id: number; name: string; symbol: string };
      unitId: number;
      unit: { id: number; name: string; symbol: string };
    };
  };
};

export type DebtGroupBy = 'bank' | 'unit';

export type GroupedDebt = {
  unitId: number;
  unit: DebtRow['payment']['account']['unit'];
  bankId: number | null;
  bank: DebtRow['payment']['account']['bank'] | null;
  fromUserId: number;
  fromUser: DebtRow['fromUser'];
  toUserId: number;
  toUser: DebtRow['toUser'];
  amount: number;
};

export type DebtSummaryRow = {
  unitId: number;
  unit: DebtRow['payment']['account']['unit'];
  bankId: number | null;
  bank: DebtRow['payment']['account']['bank'] | null;
  fromUserId: number;
  fromUser: DebtRow['fromUser'];
  toUserId: number;
  toUser: DebtRow['toUser'];
  amount: number;
};

export type DebtSummary = {
  rows: DebtSummaryRow[];
  totals: { owedToYou: number; youOwe: number };
};
