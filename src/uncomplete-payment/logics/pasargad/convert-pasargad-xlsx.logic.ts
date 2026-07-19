import { date } from 'src/common/tools/date/date.tool';
import { getPrice } from 'src/payment/logics/payment.logic';
import { CreateUncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

export type PasargadBillRow = {
  issuanceDate: string;
  amount: number;
  debtor: boolean;
  afterTxAmount: number;
  description: string;
};

export function convertPasargadXlsx(
  rows: PasargadBillRow[],
): Omit<CreateUncompletePayment, 'accountId'>[] {
  return rows.map((r) => {
    if (r.debtor) {
      return convertIncome(r);
    }

    return convertPayment(r);
  });
}

function getSource(description: string): UncompletePaymentSource {
  if (description.includes('کارت')) {
    return UncompletePaymentSource.CARD;
  }

  if (description.includes('اینترنت') || description.includes('ستاد')) {
    return UncompletePaymentSource.ONLINE;
  }

  return UncompletePaymentSource.UNKNOWN;
}

function convertPayment(
  r: PasargadBillRow,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: getSource(r.description),
    paidAt: date(r.issuanceDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    description: r.description,
    amount: getPrice(r.amount),
    remain: getPrice(r.afterTxAmount),
    type: UncompletePaymentType.PAYMENT,
  };
}

function convertIncome(
  r: PasargadBillRow,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: getSource(r.description),
    paidAt: date(r.issuanceDate).tz().format('YYYY-MM-DD HH:mm:ss'),
    description: r.description,
    amount: getPrice(r.amount),
    remain: getPrice(r.afterTxAmount),
    type: UncompletePaymentType.INCOME,
  };
}
