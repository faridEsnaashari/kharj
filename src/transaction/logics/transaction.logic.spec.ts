import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import {
  mergeAndSortByDate,
  slicePage,
  fetchLimitForPage,
} from './transaction.logic';

function buildPayment(id: number, paidAt: string): Payment {
  return { id, paidAt } as Payment;
}

function buildIncome(id: number, paidAt: string): Income {
  return { id, paidAt } as Income;
}

describe('mergeAndSortByDate', () => {
  it('tags each row with its source type', () => {
    const result = mergeAndSortByDate(
      [buildPayment(1, '2024-01-01')],
      [buildIncome(2, '2024-01-02')],
    );

    expect(result.find((t) => t.id === 1)?.type).toBe('PAYMENT');
    expect(result.find((t) => t.id === 2)?.type).toBe('INCOME');
  });

  it('interleaves payments and incomes sorted by paidAt descending', () => {
    const payments = [
      buildPayment(1, '2024-01-04'),
      buildPayment(2, '2024-01-02'),
    ];
    const incomes = [
      buildIncome(3, '2024-01-03'),
      buildIncome(4, '2024-01-01'),
    ];

    const result = mergeAndSortByDate(payments, incomes);

    expect(result.map((t) => t.id)).toEqual([1, 3, 2, 4]);
  });

  it('handles one side being empty', () => {
    const result = mergeAndSortByDate([], [buildIncome(1, '2024-01-01')]);

    expect(result.map((t) => t.id)).toEqual([1]);
  });
});

describe('slicePage', () => {
  const items = [1, 2, 3, 4, 5];

  it('returns the first page', () => {
    expect(slicePage(items, 1, 2)).toEqual([1, 2]);
  });

  it('returns a middle page', () => {
    expect(slicePage(items, 2, 2)).toEqual([3, 4]);
  });

  it('returns a short last page', () => {
    expect(slicePage(items, 3, 2)).toEqual([5]);
  });

  it('returns an empty list beyond the last page', () => {
    expect(slicePage(items, 4, 2)).toEqual([]);
  });
});

describe('fetchLimitForPage', () => {
  it('fetches enough rows from each source to fill the requested page', () => {
    expect(fetchLimitForPage(1, 20)).toBe(20);
    expect(fetchLimitForPage(3, 10)).toBe(30);
  });
});
