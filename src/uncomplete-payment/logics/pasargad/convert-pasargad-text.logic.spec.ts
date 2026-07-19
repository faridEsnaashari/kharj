import { date } from 'src/common/tools/date/date.tool';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';
import { convertPasargadText } from './convert-pasargad-text.logic';

function expectedPaidAt(monthDay: string, time: string): string {
  return date(`${date().calendar('jalali').year()}-${monthDay} ${time}`, {
    jalali: true,
  }).format('YYYY-MM-DD HH:mm:ss');
}

describe('convertPasargadText', () => {
  it('parses a withdrawal SMS as a PAYMENT', () => {
    const text =
      '777.888.14751775.1\n-1,100,000\n04/27_19:45\nمانده: 50,388,259';

    const result = convertPasargadText(text);

    expect(result).toEqual({
      source: UncompletePaymentSource.SMS,
      paidAt: expectedPaidAt('04-27', '19:45'),
      amount: 110,
      remain: 50388259,
      description: '',
      type: UncompletePaymentType.PAYMENT,
    });
  });

  it('parses a deposit SMS as an INCOME', () => {
    const text =
      '777.888.14751775.1\n+10,000\n04/28_09:28\nمانده: 50,398,259';

    const result = convertPasargadText(text);

    expect(result).toEqual({
      source: UncompletePaymentSource.SMS,
      paidAt: expectedPaidAt('04-28', '09:28'),
      amount: 1,
      remain: 50398259,
      description: '',
      type: UncompletePaymentType.INCOME,
    });
  });
});
