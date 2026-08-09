import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { Transaction } from '../types/transaction.type';
import { TransactionType } from '../enums/transaction-type.enum';
import { date } from 'src/common/tools/date/date.tool';

function getPaidAtTime(paidAt: Transaction['paidAt']): number {
  return paidAt ? date(paidAt).valueOf() : 0;
}

export function mergeAndSortByDate(
  payments: Payment[],
  incomes: Income[],
): Transaction[] {
  const merged: Transaction[] = [
    ...payments.map((p) => ({ ...p, type: TransactionType.PAYMENT })),
    ...incomes.map((i) => ({ ...i, type: TransactionType.INCOME })),
  ];

  return merged.sort(
    (a, b) => getPaidAtTime(b.paidAt) - getPaidAtTime(a.paidAt),
  );
}

export function slicePage<T>(items: T[], page: number, size: number): T[] {
  const offset = (page - 1) * size;
  return items.slice(offset, offset + size);
}

export function fetchLimitForPage(page: number, size: number): number {
  return page * size;
}
