import { calculateUpdatedBalance } from './income.logic';

describe('calculateUpdatedBalance', () => {
  it('replaces the original amount with the new one', () => {
    // balance 300 includes an income of 100; changing it to 150 gives 350
    expect(calculateUpdatedBalance(300, 100, 150)).toBe(350);
  });

  it('decreases the balance when the new amount is smaller', () => {
    expect(calculateUpdatedBalance(300, 100, 40)).toBe(240);
  });

  it('keeps the balance unchanged when the amount does not change', () => {
    expect(calculateUpdatedBalance(300, 100, 100)).toBe(300);
  });

  it('can drive the balance negative when the original exceeds it', () => {
    expect(calculateUpdatedBalance(50, 100, 0)).toBe(-50);
  });
});
