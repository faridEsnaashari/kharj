import { amountDtoSchema, isSafeAmount } from './amount.schema';

describe('amount schema', () => {
  it.each([0, 1043170, 51043170, 999999999999, 0.00000001, 12.12345678, -5.5])(
    'accepts %s',
    (value) => {
      expect(amountDtoSchema.safeParse(value).success).toBe(true);
    },
  );

  it.each([
    123456789012.12345678,
    1234567890123456,
    0.000000001,
    NaN,
    Infinity,
  ])('rejects %s', (value) => {
    expect(isSafeAmount(value)).toBe(false);
    expect(amountDtoSchema.safeParse(value).success).toBe(false);
  });

  it('reports the precision error message', () => {
    const result = amountDtoSchema.safeParse(123456789012.12345678);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('amount-precision-exceeded');
  });
});
