import { getPaymentCategoryOptions } from './payment-category.logic';
import { PaymentCategory } from '../enums/payment-category.enum';

describe('getPaymentCategoryOptions', () => {
  it('includes an option for every PaymentCategory value', () => {
    const options = getPaymentCategoryOptions();
    const keys = Object.values(options).map((option) => option.key);

    expect(keys.sort()).toEqual(Object.values(PaymentCategory).sort());
  });

  it('gives GYM_FOOD the expected shape', () => {
    const options = getPaymentCategoryOptions();

    expect(options.gymFood).toEqual({
      key: PaymentCategory.GYM_FOOD,
      value: 'gym food',
    });
  });
});
