import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { TransactionType } from '../enums/transaction-type.enum';

export type Transaction = (Payment | Income) & {
  type: TransactionType;
};
