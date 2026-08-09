import { convertMeliText } from './convert-meli-text.logic';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

// Same implementation as convertResalatText today — kept as a separate
// spec so the two don't silently diverge unnoticed if one gets edited.
describe('convertMeliText', () => {
  it('parses a payment (debit) SMS', () => {
    const text = [
      'header line',
      '-150,000',
      '25/10_14:30:00',
      'BALANCE:1,000,000',
    ].join('\n');

    const result = convertMeliText(text);

    expect(result.type).toBe(UncompletePaymentType.PAYMENT);
    expect(result.amount).toBe(15);
    expect(result.remain).toBe(1000000);
  });

  it('parses an income (credit) SMS', () => {
    const text = [
      'header line',
      '+220,000',
      '03/02_09:15:00',
      'BALANCE:500,000',
    ].join('\n');

    const result = convertMeliText(text);

    expect(result.type).toBe(UncompletePaymentType.INCOME);
    expect(result.amount).toBe(22);
  });
});
