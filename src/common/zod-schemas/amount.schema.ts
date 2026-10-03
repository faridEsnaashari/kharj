import z from 'zod';

export const AMOUNT_MAX_SIGNIFICANT_DIGITS = 15;
export const AMOUNT_MAX_DECIMALS = 8;

export const isSafeAmount = (value: number): boolean =>
  Number.isFinite(value) &&
  Number(value.toPrecision(AMOUNT_MAX_SIGNIFICANT_DIGITS)) === value &&
  Number(value.toFixed(AMOUNT_MAX_DECIMALS)) === value;

export const amountDtoSchema = z
  .number()
  .refine(isSafeAmount, { message: 'amount-precision-exceeded' });

export type AmountDto = z.infer<typeof amountDtoSchema>;
