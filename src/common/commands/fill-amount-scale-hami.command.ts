import { Command } from 'src/common/command/types/command.type';
import { Logger } from 'src/common/tools/pino/logger.tool';
import { PaymentRepository } from 'src/payment/entities/repositories/payment.repository';
import { UpdatePayment } from 'src/payment/entities/payment.entity';
import { IncomeRepository } from 'src/income/entities/repositories/income.repository';
import { UpdateIncome } from 'src/income/entities/income.entity';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { UpdateAccount } from 'src/account/entities/account.entity';
import { AccountDebtRepository } from 'src/account-debt/entities/repositories/account-debt.repository';
import { UpdateAccountDebt } from 'src/account-debt/entities/account-debt.entity';
import { ExchangeRepository } from 'src/exchange/entities/repositories/exchange.repository';
import { UpdateExchange } from 'src/exchange/entities/exchange.entity';
import { UncompletePaymentRepository } from 'src/uncomplete-payment/entities/repositories/uncomplete-payment.repository';
import { UpdateUncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UnitRepository } from 'src/unit/entities/repositories/unit.repository';

const SCALE = 10000;
const HAMI_UNIT_SYMBOL = 'HAMI';

async function scaleRows<TRow extends { id: number }, TUpdate>(
  rows: TRow[],
  updateOneById: (data: TUpdate, id: number) => Promise<void>,
  buildUpdate: (row: TRow) => TUpdate | null,
): Promise<number> {
  let affectedRows = 0;

  for (const row of rows) {
    const update = buildUpdate(row);

    if (!update) {
      continue;
    }

    await updateOneById(update, row.id);
    affectedRows += 1;
  }

  return affectedRows;
}

export const command: Command = {
  runner: async function (appContext) {
    const logger = new Logger('fill-amount-scale-hami');

    const unitRepository = appContext.get(UnitRepository);
    const paymentRepository = appContext.get(PaymentRepository);
    const incomeRepository = appContext.get(IncomeRepository);
    const accountRepository = appContext.get(AccountRepository);
    const accountDebtRepository = appContext.get(AccountDebtRepository);
    const exchangeRepository = appContext.get(ExchangeRepository);
    const uncompletePaymentRepository = appContext.get(
      UncompletePaymentRepository,
    );

    const units = await unitRepository.findAll({});
    const hamiUnitIds = new Set(
      units
        .filter((unit) => unit.symbol === HAMI_UNIT_SYMBOL)
        .map((unit) => unit.id),
    );

    const accountRows = await accountRepository.findAll({});
    const hamiAccountIds = new Set(
      accountRows
        .filter((account) => hamiUnitIds.has(account.unitId))
        .map((account) => account.id),
    );

    const paymentRows = await paymentRepository.findAll({});
    const paymentAccountById = new Map(
      paymentRows.map((payment) => [payment.id, payment.accountId]),
    );

    const incomeRows = await incomeRepository.findAll({});
    const incomeAccountById = new Map(
      incomeRows.map((income) => [income.id, income.accountId]),
    );

    const accountAffectedRows = await scaleRows(
      accountRows,
      (data: UpdateAccount, id) => accountRepository.updateOneById(data, id),
      (row) =>
        hamiAccountIds.has(row.id) ? { ballance: row.ballance * SCALE } : null,
    );

    const paymentAffectedRows = await scaleRows(
      paymentRows,
      (data: UpdatePayment, id) => paymentRepository.updateOneById(data, id),
      (row) =>
        hamiAccountIds.has(row.accountId)
          ? { amount: row.amount * SCALE, remain: row.remain * SCALE }
          : null,
    );

    const incomeAffectedRows = await scaleRows(
      incomeRows,
      (data: UpdateIncome, id) => incomeRepository.updateOneById(data, id),
      (row) =>
        hamiAccountIds.has(row.accountId)
          ? { amount: row.amount * SCALE, remain: row.remain * SCALE }
          : null,
    );

    const accountDebtRows = await accountDebtRepository.findAll({});
    const accountDebtAffectedRows = await scaleRows(
      accountDebtRows,
      (data: UpdateAccountDebt, id) =>
        accountDebtRepository.updateOneById(data, id),
      (row) => {
        const accountId = paymentAccountById.get(row.paymentId);

        return accountId !== undefined && hamiAccountIds.has(accountId)
          ? { amount: row.amount * SCALE }
          : null;
      },
    );

    const exchangeRows = await exchangeRepository.findAll({});
    const exchangeAffectedRows = await scaleRows(
      exchangeRows,
      (data: UpdateExchange, id) => exchangeRepository.updateOneById(data, id),
      (row) => {
        const fromAccountId = paymentAccountById.get(row.paymentId);
        const toAccountId = incomeAccountById.get(row.incomeId);
        const scaleFrom =
          fromAccountId !== undefined && hamiAccountIds.has(fromAccountId);
        const scaleTo =
          toAccountId !== undefined && hamiAccountIds.has(toAccountId);

        if (!scaleFrom && !scaleTo) {
          return null;
        }

        return {
          ...(scaleFrom ? { fromAmount: row.fromAmount * SCALE } : {}),
          ...(scaleTo ? { toAmount: row.toAmount * SCALE } : {}),
        };
      },
    );

    const uncompletePaymentRows = await uncompletePaymentRepository.findAll({});
    const uncompletePaymentAffectedRows = await scaleRows(
      uncompletePaymentRows,
      (data: UpdateUncompletePayment, id) =>
        uncompletePaymentRepository.updateOneById(data, id),
      (row) =>
        hamiAccountIds.has(row.accountId)
          ? {
              amount: row.amount * SCALE,
              ...(row.source !== UncompletePaymentSource.SMS
                ? { remain: row.remain * SCALE }
                : {}),
            }
          : null,
    );

    logger.log({
      key: 'FILL_AMOUNT_SCALE_HAMI',
      data: {
        hamiUnitCount: hamiUnitIds.size,
        hamiAccountCount: hamiAccountIds.size,
        accountAffectedRows,
        paymentAffectedRows,
        incomeAffectedRows,
        accountDebtAffectedRows,
        exchangeAffectedRows,
        uncompletePaymentAffectedRows,
      },
    });

    return { isSuccess: true, error: null };
  },

  cmd: 'fill-amount-scale-hami',
  describe:
    'Multiplies every stored amount belonging to a Hami-unit account (payments, incomes, account balances, account debts, exchanges, uncomplete payments) by 10000, undoing the old trimmed-unit convention — non-Hami units are left untouched',
};
