import { Income } from 'src/income/entities/income.entity';
import { createTestAccounts } from './account.logic';
import { makeAppReq } from './request.logic';
import { signinTestUsers } from './auth/signin.logic';
import { date } from 'src/common/tools/date/date.tool';
import { Account } from 'src/account/entities/account.entity';

export async function createTestIncome(makeReq: ReturnType<typeof makeAppReq>) {
  const { owner } = await signinTestUsers(makeReq);
  const {
    after: accountAfter,
    ownerAccount,
    otherAccount,
  } = await createTestAccounts(makeReq);

  const income = await makeReq<Income>({
    method: 'post',
    baseUrl: '/income',
    token: owner.data.token,
    body: {
      accountId: ownerAccount.data.id,
      amount: 10,
      category: 'HOGHOOGH',
      paidAt: '2026-07-30 05:57:00',
      description: 'fsdfsdf',
    },
  });

  expect(income.success).toBeTruthy();
  expect({
    ...income.data,
    paidAt: date(income.data.paidAt).format('YYYY-MM-DD HH:mm:ss'),
  }).toMatchObject({
    amount: 10,
    category: 'HOGHOOGH',
    description: 'fsdfsdf',
    paidAt: '2026-07-30 05:57:00',
    accountId: ownerAccount.data.id,
    remain: 10,
  });

  let updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${ownerAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(10);

  const otherIncome = await makeReq<Income>({
    method: 'post',
    baseUrl: '/income',
    token: owner.data.token,
    body: {
      accountId: otherAccount.data.id,
      amount: 10,
      category: 'HOGHOOGH',
      paidAt: '2026-07-30 05:57:00',
      description: 'fsdfsdf',
    },
  });

  expect(otherIncome.success).toBeTruthy();
  expect({
    ...otherIncome.data,
    paidAt: date(otherIncome.data.paidAt).format('YYYY-MM-DD HH:mm:ss'),
  }).toMatchObject({
    amount: 10,
    category: 'HOGHOOGH',
    description: 'fsdfsdf',
    paidAt: '2026-07-30 05:57:00',
    accountId: otherAccount.data.id,
    remain: 10,
  });

  updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${ownerAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(10);

  updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${otherAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(10);

  return {
    after: async () => {
      await makeReq({
        method: 'delete',
        baseUrl: `/income/${income.data.id}`,
        token: owner.data.token,
      });
      await makeReq({
        method: 'delete',
        baseUrl: `/income/${otherIncome.data.id}`,
        token: owner.data.token,
      });
      await accountAfter();
    },
  };
}
