import { Exchange } from 'src/exchange/entities/exchange.entity';
import { Income } from 'src/income/entities/income.entity';
import { Account } from 'src/account/entities/account.entity';
import { createTestAccounts } from './account.logic';
import { makeAppReq } from './request.logic';
import { signinTestUsers } from './auth/signin.logic';

export async function createTestExchange(
  makeReq: ReturnType<typeof makeAppReq>,
) {
  const { owner, relations } = await signinTestUsers(makeReq);
  const {
    after: accountAfter,
    ownerAccount,
    otherAccount,
  } = await createTestAccounts(makeReq);

  const funding = await makeReq<Income>({
    method: 'post',
    baseUrl: '/income',
    token: owner.data.token,
    body: {
      accountId: ownerAccount.data.id,
      amount: 500,
      category: 'HOGHOOGH',
      paidAt: '2026-07-30 05:57:00',
      description: 'funding for exchange e2e',
    },
  });

  expect(funding.success).toBeTruthy();

  const exchange = await makeReq<Exchange>({
    method: 'post',
    baseUrl: '/exchange',
    token: owner.data.token,
    body: {
      fromAccountId: ownerAccount.data.id,
      toAccountId: otherAccount.data.id,
      toUser: relations.data[0].id,
      fromAmount: 100,
      toAmount: 90,
      paidAt: '2026-07-30 06:00:00',
    },
  });

  expect(exchange.success).toBeTruthy();
  expect(exchange.data).toMatchObject({
    fromAmount: 100,
    toAmount: 90,
  });

  let updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${ownerAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(400);

  updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${otherAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(90);

  return {
    exchange,
    after: async () => {
      await makeReq({
        method: 'delete',
        baseUrl: `/exchange/${exchange.data.id}`,
        token: owner.data.token,
      });
      await makeReq({
        method: 'delete',
        baseUrl: `/income/${funding.data.id}`,
        token: owner.data.token,
      });
      await accountAfter();
    },
  };
}
