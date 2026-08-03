import { Payment } from 'src/payment/entities/payment.entity';
import { Income } from 'src/income/entities/income.entity';
import { Account } from 'src/account/entities/account.entity';
import { AccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { Paginated } from 'src/common/types/pagination.type';
import { createTestAccounts } from './account.logic';
import { makeAppReq } from './request.logic';
import { signinTestUsers } from './auth/signin.logic';
import { date } from 'src/common/tools/date/date.tool';

export async function createTestPayment(
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
      accountId: otherAccount.data.id,
      amount: 500,
      category: 'HOGHOOGH',
      paidAt: '2026-07-30 05:57:00',
      description: 'funding for payment e2e',
    },
  });

  expect(funding.success).toBeTruthy();

  const payments = await makeReq<Payment[]>({
    method: 'post',
    baseUrl: '/payment',
    token: owner.data.token,
    body: {
      price: 200,
      bankId: ownerAccount.data.bankId,
      unitId: ownerAccount.data.unitId,
      ownerId: relations.data[0].id,
      category: 'FOOD',
      isFun: false,
      isMaman: false,
      paidAt: '2026-07-30 06:00:00',
      description: 'payment e2e',
    },
  });

  expect(payments.success).toBeTruthy();

  const debitedPayment = payments.data.find(
    (p) => p.accountId === otherAccount.data.id,
  )!;

  expect({
    ...debitedPayment,
    paidAt: date(debitedPayment.paidAt).format('YYYY-MM-DD HH:mm:ss'),
  }).toMatchObject({
    amount: 200,
    category: 'FOOD',
    description: 'payment e2e',
    paidAt: '2026-07-30 06:00:00',
    accountId: otherAccount.data.id,
    remain: 300,
  });

  const debts = await makeReq<Paginated<AccountDebt>>({
    method: 'get',
    baseUrl: '/debt',
    token: owner.data.token,
    query: {
      fromUserId: String(relations.data[1].id),
      toUserId: String(relations.data[0].id),
    },
  });

  const debt = debts.data.rows.find((d) => d.paymentId === debitedPayment.id);

  expect(debt).toMatchObject({
    amount: 200,
    fromUserId: relations.data[1].id,
    toUserId: relations.data[0].id,
  });

  let updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${otherAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(300);

  updatedAccount = await makeReq<Account>({
    method: 'get',
    token: owner.data.token,
    baseUrl: `/account/${ownerAccount.data.id}`,
  });

  expect(updatedAccount.data.ballance).toBe(0);

  return {
    payments,
    debt,
    after: async () => {
      for (const payment of payments.data) {
        await makeReq({
          method: 'delete',
          baseUrl: `/payment/${payment.id}`,
          token: owner.data.token,
        });
      }
      await makeReq({
        method: 'delete',
        baseUrl: `/income/${funding.data.id}`,
        token: owner.data.token,
      });
      await accountAfter();
    },
  };
}
