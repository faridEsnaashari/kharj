import { CategoryOption } from 'src/common/types/category.type';
import { PaymentCategory } from '../enums/payment-category.enum';

export function getPaymentCategoryOptions(): Record<
  string,
  CategoryOption<PaymentCategory>
> {
  return {
    food: { key: PaymentCategory.FOOD, value: 'food' },
    halehoole: { key: PaymentCategory.HALEHOOLE, value: 'halehoole' },
    gymFood: { key: PaymentCategory.GYM_FOOD, value: 'gym food' },
    smoke: { key: PaymentCategory.SMOKE, value: 'smoke' },
    home: { key: PaymentCategory.HOME, value: 'home' },
    coffe: { key: PaymentCategory.COFFE, value: 'coffe' },
    gym: { key: PaymentCategory.GYM, value: 'gym' },
    rent: { key: PaymentCategory.RENT, value: 'rent' },
    fruit: { key: PaymentCategory.FRUIT, value: 'fruit' },
    loan: { key: PaymentCategory.LOAN, value: 'loan' },
    internet: { key: PaymentCategory.INTERNET, value: 'internet' },
    cosmetics: { key: PaymentCategory.COSMETICS, value: 'cosmetics' },
    transfer: { key: PaymentCategory.TRANSFER, value: 'transfer' },
    clothes: { key: PaymentCategory.CLOTHES, value: 'clothes' },
    ms: { key: PaymentCategory.MS, value: 'ms' },
    nemidoonam: { key: PaymentCategory.NEMIDOONAM, value: 'nemidoonam' },
    cowork: { key: PaymentCategory.COWORK, value: 'cowork' },
    bedehi: { key: PaymentCategory.BEDEHI, value: 'bedehi' },
    exchange: { key: PaymentCategory.EXCHANGE, value: 'exchange' },
    bank: { key: PaymentCategory.BANK, value: 'bank' },
    date: { key: PaymentCategory.DATE, value: 'date' },
    gift: { key: PaymentCategory.GIFT, value: 'gift' },
    health: { key: PaymentCategory.HEALTH, value: 'health' },
  };
}
