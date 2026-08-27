import { date } from 'src/common/tools/date/date.tool';
import { convertMelyXlsx } from './convert-mely-xlsx.logic';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

function row(overrides: Record<string, unknown>): Record<string, string> {
  return {
    __EMPTY: 1,
    __EMPTY_1: '1405/04/29',
    __EMPTY_2: '20:54:37',
    __EMPTY_4: 'برداشت',
    __EMPTY_5: '150,000',
    __EMPTY_8: 'description',
    __EMPTY_10: '850,000',
    ...overrides,
  } as unknown as Record<string, string>;
}

describe('convertMelyXlsx', () => {
  it('drops metadata/header rows that have no numeric row index', () => {
    const rows = [
      { __EMPTY: 'account-holder' }, // metadata row
      { __EMPTY: 'ردیف' }, // Persian header row
      row({}),
    ] as unknown as Record<string, string>[];

    const result = convertMelyXlsx(rows);

    expect(result).toHaveLength(1);
  });

  it('maps a برداشت row to a payment', () => {
    const result = convertMelyXlsx([
      row({ __EMPTY_4: 'برداشت', __EMPTY_5: '150,000', __EMPTY_10: '850,000' }),
    ]);

    expect(result[0].type).toBe(UncompletePaymentType.PAYMENT);
    expect(result[0].amount).toBe(150000);
    expect(result[0].remain).toBe(850000);
  });

  it('maps a واریز row to an income', () => {
    const result = convertMelyXlsx([
      row({
        __EMPTY_4: 'واریز',
        __EMPTY_5: '220,000',
        __EMPTY_10: '1,070,000',
      }),
    ]);

    expect(result[0].type).toBe(UncompletePaymentType.INCOME);
    expect(result[0].amount).toBe(220000);
    expect(result[0].remain).toBe(1070000);
  });

  it('builds paidAt from the Jalali تاریخ + زمان columns', () => {
    const result = convertMelyXlsx([
      row({ __EMPTY_1: '1405/04/29', __EMPTY_2: '20:54:37' }),
    ]);

    expect(result[0].paidAt).toBe(
      date('1405/04/29 20:54:37', { jalali: true }).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
    );
  });

  it.each([
    ['خريد اينترنتي', UncompletePaymentSource.ONLINE],
    ['انتقال به كارت', UncompletePaymentSource.CARD],
    ['خرید اینترنتی', UncompletePaymentSource.ONLINE],
    ['واریز حقوق', UncompletePaymentSource.UNKNOWN],
  ])(
    'normalises Arabic ي/ك before matching source keywords in "%s"',
    (description, expected) => {
      const result = convertMelyXlsx([row({ __EMPTY_8: description })]);

      expect(result[0].source).toBe(expected);
      expect(result[0].description).toBe(description);
    },
  );
});
