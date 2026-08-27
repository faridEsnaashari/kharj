import { date } from 'src/common/tools/date/date.tool';
import { convertPasargadText } from './convert-pasargad-text.logic';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

describe('convertPasargadText', () => {
  it('parses a payment (debit) SMS', () => {
    const text = [
      'header line',
      '-150,000',
      '25/10_14:30:00',
      'BALANCE:1,000,000',
    ].join('\n');

    const result = convertPasargadText(text);
    const year = date().calendar('jalali').year();

    expect(result.type).toBe(UncompletePaymentType.PAYMENT);
    expect(result.source).toBe(UncompletePaymentSource.SMS);
    expect(result.amount).toBe(150000);
    expect(result.remain).toBe(1000000);
    expect(result.paidAt).toBe(
      date(`${year}-25-10 14:30:00`, { jalali: true }).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
    );
  });

  it('parses an income (credit) SMS', () => {
    const text = [
      'header line',
      '+220,000',
      '03/02_09:15:00',
      'BALANCE:500,000',
    ].join('\n');

    const result = convertPasargadText(text);

    expect(result.type).toBe(UncompletePaymentType.INCOME);
    expect(result.source).toBe(UncompletePaymentSource.SMS);
    expect(result.amount).toBe(220000);
    expect(result.remain).toBe(500000);
  });
});
