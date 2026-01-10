import { Account } from 'src/account/entities/account.entity';
import { CreatePaymentDto } from '../dtos/craete-payment.dto';
import { SelectedAccount } from './payment.logic.type';
import { User } from 'src/user/entities/user.entity';

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
      continue;
    }

    if (remain <= acc.ballance) {
      selectedAccounts = [
        ...selectedAccounts,
        {
          ...acc,
          ballance: acc.ballance - remain,
          minus: remain,
        },
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

export function sortAccounts(
  accounts: Account[],
  targetUserId: User['id'],
): Account[] {
  const otherAccs = accounts.filter((acc) => acc.ownedBy !== targetUserId);
  const targetAcc = accounts.find((acc) => acc.ownedBy === targetUserId)!;

  return [targetAcc, ...otherAccs];
}

export function getPrice(price: number): number {
  return Math.floor(price);
}
