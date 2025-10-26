import { Account } from 'src/account/entities/account.entity';
import { CreatePaymentDto } from '../dtos/craete-payment.dto';
import { SelectedAccount } from './payment.logic.type';

export function selectAccountsForPayment(
  accounts: Account[],
  price: CreatePaymentDto['price'],
): { selectedAccounts: SelectedAccount[]; remain: number } {
  let remain = price;

  let selectedAccounts: SelectedAccount[] = [];

  for (const acc of accounts) {
    if (remain <= 0) {
      break;
    }

    if (acc.ballance <= 0) {
      selectedAccounts = [...selectedAccounts, { ...acc, minus: 0 }];
    }

    if (remain <= acc.ballance) {
      selectedAccounts = [
        ...selectedAccounts,
        { ...acc, ballance: acc.ballance - remain, minus: 0 },
      ];

      remain = 0;
      continue;
    }

    selectedAccounts = [
      ...selectedAccounts,
      { ...acc, ballance: 0, minus: acc.ballance },
    ];

    remain -= acc.ballance;
  }

  return { selectedAccounts, remain };
}
