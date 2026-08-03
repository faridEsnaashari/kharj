import { Bank } from 'src/bank/entities/bank.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { Account } from 'src/account/entities/account.entity';
import { makeAppReq } from './request.logic';
import { signinTestUsers } from './auth/signin.logic';

export async function createTestAccounts(
  makeReq: ReturnType<typeof makeAppReq>,
) {
  const { owner, relations } = await signinTestUsers(makeReq);

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

  const bank = banks.data.find((b) => b.symbol === 'RESALAT')!;
  const unit = units.data.find((u) => u.symbol === 'RIAL')!;

  expect(unit?.symbol).toBe('RIAL');
  expect(bank?.symbol).toBe('RESALAT');

  const ownerAccount = await makeReq<Account>({
    method: 'post',
    baseUrl: '/account',
    token: owner.data.token,
    body: {
      bankId: bank.id,
      unitId: unit.id,
      ownedBy: relations.data[0].id,
      ballance: 0,
      priority: 0,
    },
  });

  expect(ownerAccount.success).toBeTruthy();
  expect(ownerAccount.data).toMatchObject({
    ballance: 0,
    bankId: bank.id,
    ownedBy: relations.data[0].id,
    unitId: unit.id,
    userId: relations.data[0].id,
  });

  const existAccount = await makeReq<Account>({
    method: 'post',
    baseUrl: '/account',
    token: owner.data.token,
    body: {
      bankId: bank.id,
      unitId: unit.id,
      ownedBy: relations.data[0].id,
      ballance: 0,
      priority: 0,
    },
  });

  expect(existAccount.success).toBeFalsy();

  const otherAccount = await makeReq<Account>({
    method: 'post',
    baseUrl: '/account',
    token: owner.data.token,
    body: {
      bankId: bank.id,
      unitId: unit.id,
      ownedBy: relations.data[1].id,
      ballance: 0,
      priority: 1,
    },
  });

  expect(otherAccount.success).toBeTruthy();
  expect(otherAccount.data).toMatchObject({
    ballance: 0,
    bankId: bank.id,
    ownedBy: relations.data[1].id,
    unitId: unit.id,
    userId: relations.data[0].id,
  });

  const existOtherAccount = await makeReq<Account>({
    method: 'post',
    baseUrl: '/account',
    token: owner.data.token,
    body: {
      bankId: bank.id,
      unitId: unit.id,
      ownedBy: relations.data[1].id,
      ballance: 0,
      priority: 0,
    },
  });

  expect(existOtherAccount.success).toBeFalsy();

  return {
    ownerAccount,
    otherAccount,
    after: async () => {
      await makeReq({
        method: 'delete',
        baseUrl: `/account/${ownerAccount.data.id}`,
        token: owner.data.token,
      });
      await makeReq({
        method: 'delete',
        baseUrl: `/account/${otherAccount.data.id}`,
        token: owner.data.token,
      });
    },
  };
}
