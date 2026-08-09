import { Account } from 'src/account/entities/account.entity';
import { Income } from 'src/income/entities/income.entity';
import { date } from 'src/common/tools/date/date.tool';
import { SignedInUserTest } from './auth/signin.logic';
import { KharjResponse, makeAppReq } from 'test/utils/request.logic';

export type TestIncome = {
  account: Account;
  amount: Income['amount'];
  category: Income['category'];
  paidAt: Income['paidAt'];
  description?: Income['description'];
};

export function createTestIncome(makeReq: ReturnType<typeof makeAppReq>) {
  let owner: SignedInUserTest['owner'] | null = null;
  const created: KharjResponse<Income>[] = [];

  return {
    test: async ({
      users,
      incomes,
    }: {
      users: SignedInUserTest;
      incomes: TestIncome[];
    }) => {
      owner = users.owner;

      const runningBalance = new Map<Account['id'], Account['ballance']>();

      for (const incomeInput of incomes) {
        const accountId = incomeInput.account.id;

        if (!runningBalance.has(accountId)) {
          runningBalance.set(accountId, incomeInput.account.ballance);
        }

        const income = await makeReq<Income>({
          method: 'post',
          baseUrl: '/income',
          token: owner.data.token,
          body: {
            accountId,
            amount: incomeInput.amount,
            category: incomeInput.category,
            paidAt: incomeInput.paidAt,
            description: incomeInput.description,
          },
        });

        expect(income.success).toBeTruthy();
        expect({
          ...income.data,
          paidAt: date(income.data.paidAt).format('YYYY-MM-DD HH:mm:ss'),
        }).toMatchObject({
          amount: incomeInput.amount,
          category: incomeInput.category,
          ...(incomeInput.description
            ? { description: incomeInput.description }
            : {}),
          paidAt: incomeInput.paidAt,
          accountId,
        });

        created.push(income);

        const expectedBalance =
          runningBalance.get(accountId)! + incomeInput.amount;

        runningBalance.set(accountId, expectedBalance);

        const updatedAccount = await makeReq<Account>({
          method: 'get',
          token: owner.data.token,
          baseUrl: `/account/${accountId}`,
        });

        expect(updatedAccount.data.ballance).toBe(expectedBalance);
      }

      return created;
    },
    after: async () => {
      return Promise.all(
        created.map((income) =>
          makeReq({
            method: 'delete',
            baseUrl: `/income/${income.data.id}`,
            token: owner?.data.token,
          }),
        ),
      );
    },
  };
}
