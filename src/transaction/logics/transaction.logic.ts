import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { Transaction } from '../types/transaction.type';

export function mergeAndSortByDate(
  payments: Payment[],
  incomes: Income[],
): Transaction[] {
  const merged: Transaction[] = [
    ...payments.map((p) => ({ ...p, type: 'PAYMENT' as const })),
    ...incomes.map((i) => ({ ...i, type: 'INCOME' as const })),
  ];

  return merged.sort((a, b) => (a.paidAt < b.paidAt ? 1 : -1));
}

export function slicePage<T>(items: T[], page: number, size: number): T[] {
  const offset = (page - 1) * size;
  return items.slice(offset, offset + size);
}

export function fetchLimitForPage(page: number, size: number): number {
  return page * size;
}
