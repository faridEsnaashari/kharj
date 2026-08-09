import { getIncomeCategoryOptions } from './income-category.logic';
import { IncomeCategory } from '../enums/income-category.enum';

describe('getIncomeCategoryOptions', () => {
  it('includes an option for every IncomeCategory value', () => {
    const options = getIncomeCategoryOptions();
    const keys = Object.values(options).map((option) => option.key);

    expect(keys.sort()).toEqual(Object.values(IncomeCategory).sort());
  });

  it('gives HOGHOOGH the expected shape', () => {
    const options = getIncomeCategoryOptions();

    expect(options.hoghoogh).toEqual({
      key: IncomeCategory.HOGHOOGH,
      value: 'hoghoogh',
    });
  });
});
