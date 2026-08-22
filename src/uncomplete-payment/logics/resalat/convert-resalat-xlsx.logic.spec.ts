import { date } from 'src/common/tools/date/date.tool';
import { convertResalatXlsx } from './convert-resalat-xlsx.logic';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

function row(overrides: Record<string, string | number>) {
  return {
    __EMPTY_1: 'کارت',
    __EMPTY_2: '1402/07/03',
    __EMPTY_3: '14:30:00',
    __EMPTY_7: 'description',
    __EMPTY_8: 0,
    __EMPTY_9: 0,
    __EMPTY_10: 0,
    ...overrides,
  };
}

describe('convertResalatXlsx', () => {
  it('drops the first 2 header rows and the last footer row, parsing the rest', () => {
    const rows = [
      {}, // header
      {}, // header
      row({ __EMPTY_1: 'کارت', __EMPTY_8: 150000, __EMPTY_10: 850000 }), // payment via card
      row({
        __EMPTY_1: 'ستاد',
        __EMPTY_8: 0,
        __EMPTY_9: 220000,
        __EMPTY_10: 1070000,
      }), // income via online
      row({ __EMPTY_1: 'other', __EMPTY_8: 50000, __EMPTY_10: 1020000 }), // payment, unknown source
      {}, // footer
    ];

    const result = convertResalatXlsx(rows);

    expect(result).toHaveLength(3);

    expect(result[0].type).toBe(UncompletePaymentType.PAYMENT);
    expect(result[0].source).toBe(UncompletePaymentSource.CARD);
    expect(result[0].amount).toBe(150000);
    expect(result[0].remain).toBe(850000);

    expect(result[1].type).toBe(UncompletePaymentType.INCOME);
    expect(result[1].source).toBe(UncompletePaymentSource.ONLINE);
    expect(result[1].amount).toBe(220000);

    expect(result[2].source).toBe(UncompletePaymentSource.UNKNOWN);

    const expectedPaidAt = date('1402/07/03 14:30:00', { jalali: true }).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    expect(result[0].paidAt).toBe(expectedPaidAt);
  });
});
