import { Exchange } from 'src/exchange/entities/exchange.entity';
import { Account } from 'src/account/entities/account.entity';
import { CreateExchangeDto } from 'src/exchange/dtos/create-exchange.dto';
import { SignedInUserTest } from './auth/signin.logic';
import { makeAppReq } from 'test/utils/request.logic';

export type TestExchange = {
  fromAccountId: Account['id'];
  toAccountId: Account['id'];
  toUser: Account['ownedBy'];
  fromAmount: Exchange['fromAmount'];
  toAmount: Exchange['toAmount'];
  paidAt: CreateExchangeDto['paidAt'];
};

export function createTestExchange(makeReq: ReturnType<typeof makeAppReq>) {
  let owner: SignedInUserTest['owner'] | null = null;
  const created: Exchange[] = [];

  return {
    test: async ({
      users,
      fromAccount,
      toAccount,
      exchange,
    }: {
      users: SignedInUserTest;
      fromAccount: Account;
      toAccount: Account;
      exchange: TestExchange;
    }) => {
      owner = users.owner;

      const beforeFrom = await makeReq<Account>({
        method: 'get',
        token: owner.data.token,
        baseUrl: `/account/${fromAccount.id}`,
      });
      const beforeTo = await makeReq<Account>({
        method: 'get',
        token: owner.data.token,
        baseUrl: `/account/${toAccount.id}`,
      });

      const result = await makeReq<Exchange>({
        method: 'post',
        baseUrl: '/exchange',
        token: owner.data.token,
        body: exchange,
      });

      created.push(result.data);

      expect(result.success).toBeTruthy();
      expect(result.data).toMatchObject({
        fromAmount: exchange.fromAmount,
        toAmount: exchange.toAmount,
      });

      const afterFrom = await makeReq<Account>({
        method: 'get',
        token: owner.data.token,
        baseUrl: `/account/${fromAccount.id}`,
      });

      expect(afterFrom.data.ballance).toBe(
        beforeFrom.data.ballance - exchange.fromAmount,
      );

      const afterTo = await makeReq<Account>({
        method: 'get',
        token: owner.data.token,
        baseUrl: `/account/${toAccount.id}`,
      });

      expect(afterTo.data.ballance).toBe(
        beforeTo.data.ballance + exchange.toAmount,
      );

      return result.data;
    },
    after: async () => {
      return Promise.all(
        created.map((exchange) =>
          makeReq({
            method: 'delete',
            baseUrl: `/exchange/${exchange.id}`,
            token: owner?.data.token,
          }),
        ),
      );
    },
  };
}
