import { Bank } from 'src/bank/entities/bank.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Account } from 'src/account/entities/account.entity';
import { SignedInUserTest } from './auth/signin.logic';
import {
  KharjResponse,
  makeAppReq,
  SignedInUser,
} from 'test/utils/request.logic';

export type TestAccount = {
  ownedBy: Account['ownedBy'];
  userId: Account['userId'];
  ballance: Account['ballance'];
  priority: Account['priority'];
  bank: { symbol: Bank['symbol'] };
  unit: { symbol: Bank['symbol'] };
};

export function createTestAccount(makeReq: ReturnType<typeof makeAppReq>) {
  let owner: KharjResponse<SignedInUser> | null = null;
  const created: KharjResponse<Account>[] = [];

  return {
    test: async ({
      users,
      accounts,
    }: {
      users: SignedInUserTest;
      accounts: TestAccount[];
    }) => {
      owner = users.owner;

      const banks = await makeReq<Bank[]>({
        method: 'get',
        baseUrl: '/bank',
        token: owner.data.token,
      });

      expect(banks.success).toBeTruthy();
      expect(banks.data.length).toBeGreaterThan(0);

      const units = await makeReq<Unit[]>({
        method: 'get',
        baseUrl: '/unit',
        token: owner.data.token,
      });

      expect(units.success).toBeTruthy();
      expect(units.data.length).toBeGreaterThan(0);

      for (const accountInput of accounts) {
        const bank = banks.data.find(
          (b) => b.symbol === accountInput.bank.symbol,
        )!;
        const unit = units.data.find(
          (u) => u.symbol === accountInput.unit.symbol,
        )!;

        expect(bank?.symbol).toBe(accountInput.bank.symbol);
        expect(unit?.symbol).toBe(accountInput.unit.symbol);

        const account = await makeReq<Account>({
          method: 'post',
          baseUrl: '/account',
          token: owner.data.token,
          body: {
            bankId: bank.id,
            unitId: unit.id,
            ownedBy: accountInput.ownedBy,
            ballance: accountInput.ballance,
            priority: accountInput.priority,
          },
        });

        created.push(account);

        expect(account.success).toBeTruthy();
        expect(account.data).toMatchObject({
          ballance: accountInput.ballance,
          bankId: bank.id,
          ownedBy: accountInput.ownedBy,
          unitId: unit.id,
          userId: accountInput.userId,
        });

        const existAccount = await makeReq<Account>({
          method: 'post',
          baseUrl: '/account',
          token: owner.data.token,
          body: {
            bankId: bank.id,
            unitId: unit.id,
            ownedBy: accountInput.ownedBy,
            ballance: accountInput.ballance,
            priority: accountInput.priority,
          },
        });

        expect(existAccount.success).toBeFalsy();
      }

      return created;
    },
    after: async () => {
      return Promise.all(
        created.map((account) =>
          makeReq({
            method: 'delete',
            baseUrl: `/account/${account.data.id}`,
            token: owner?.data.token,
          }),
        ),
      );
    },
  };
}
