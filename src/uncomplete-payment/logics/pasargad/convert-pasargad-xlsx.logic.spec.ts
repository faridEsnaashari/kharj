import { date } from 'src/common/tools/date/date.tool';
import {
  convertPasargadXlsx,
  PasargadBillRow,
} from './convert-pasargad-xlsx.logic';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

function row(overrides: Partial<PasargadBillRow>): PasargadBillRow {
  return {
    issuanceDate: '2023-09-25T10:00:00.000Z',
    amount: 150000,
    debtor: false,
    afterTxAmount: 850000,
    description: 'description',
    ...overrides,
  };
}

describe('convertPasargadXlsx', () => {
  it('maps a non-debtor row to a payment', () => {
    const result = convertPasargadXlsx([
      row({ debtor: false, amount: 150000, afterTxAmount: 850000 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(UncompletePaymentType.PAYMENT);
    expect(result[0].amount).toBe(150000);
    expect(result[0].remain).toBe(850000);
  });

  it('maps a debtor row to an income', () => {
    const result = convertPasargadXlsx([
      row({ debtor: true, amount: 220000, afterTxAmount: 1070000 }),
    ]);

    expect(result[0].type).toBe(UncompletePaymentType.INCOME);
    expect(result[0].amount).toBe(220000);
    expect(result[0].remain).toBe(1070000);
  });

  it('converts issuanceDate from UTC into Asia/Tehran before formatting', () => {
    const issuanceDate = '2023-09-25T10:00:00.000Z';

    const result = convertPasargadXlsx([row({ issuanceDate })]);

    expect(result[0].paidAt).toBe(
      date(issuanceDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    );
  });

  it.each([
    ['کارت خرید', UncompletePaymentSource.CARD],
    ['خرید اینترنتی', UncompletePaymentSource.ONLINE],
    ['واریز ستاد', UncompletePaymentSource.ONLINE],
    ['واریز حقوق', UncompletePaymentSource.UNKNOWN],
  ])('resolves source from description %s', (description, expected) => {
    const result = convertPasargadXlsx([row({ description })]);

    expect(result[0].source).toBe(expected);
    expect(result[0].description).toBe(description);
  });
});
