import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';

export type TransactionType = 'PAYMENT' | 'INCOME';

export type Transaction = (Payment | Income) & {
  type: TransactionType;
};
