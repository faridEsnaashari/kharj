import { CategoryOption } from 'src/common/types/category.type';
import { IncomeCategory } from '../enums/income-category.enum';

export function getIncomeCategoryOptions(): Record<
  string,
  CategoryOption<IncomeCategory>
> {
  return {
    hoghoogh: { key: IncomeCategory.HOGHOOGH, value: 'hoghoogh' },
    mosaedeh: { key: IncomeCategory.MOSAEDEH, value: 'mosaedeh' },
    bedehi: { key: IncomeCategory.BEDEHI, value: 'bedehi' },
    loan: { key: IncomeCategory.LOAN, value: 'loan' },
    exchange: { key: IncomeCategory.EXCHANGE, value: 'exchange' },
    snapp: { key: IncomeCategory.SNAPP, value: 'snapp' },
    ms: { key: IncomeCategory.MS, value: 'ms' },
  };
}
