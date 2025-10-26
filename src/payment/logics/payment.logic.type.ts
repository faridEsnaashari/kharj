import { Account } from 'src/account/entities/account.entity';

export type SelectedAccount = Account & { minus: Account['ballance'] };
