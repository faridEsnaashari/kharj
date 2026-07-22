import { date } from 'src/common/tools/date/date.tool';
import { getPrice } from 'src/payment/logics/payment.logic';
import { CreateUncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

/*
 * Bank Mely "account turnover" xls export. Positional __EMPTY_N columns:
 *
 *   __EMPTY    ردیف (row index — numeric on transaction rows only)
 *   __EMPTY_1  تاریخ (Jalali date, e.g. 1405/04/29)
 *   __EMPTY_2  زمان (time, e.g. 20:54:37)
 *   __EMPTY_4  نوع — برداشت (withdrawal → payment) / واریز (deposit → income)
 *   __EMPTY_5  مبلغ (amount, comma-separated rial string)
 *   __EMPTY_8  شرح (description)
 *   __EMPTY_10 مانده (balance after the transaction, comma-separated)
 *
 * The file opens with account-holder metadata rows and a Persian header row;
 * neither carries a numeric row index, which is how data rows are recognised.
 */

const WITHDRAWAL_TYPE = 'برداشت';

export function convertMelyXlsx(
  xlsx: Record<string, string>[],
): Omit<CreateUncompletePayment, 'accountId'>[] {
  return xlsx.filter(isTransactionRow).map((r) => {
    if (r['__EMPTY_4'] === WITHDRAWAL_TYPE) {
      return convertPayment(r);
    }

    return convertIncome(r);
  });
}

function isTransactionRow(r: Record<string, string>): boolean {
  return typeof (r['__EMPTY'] as unknown) === 'number';
}

/*
 * The export mixes Arabic and Persian forms of ی and ک (e.g. "خريد اينترنتي",
 * "انتقال به كارت") — normalise before matching keywords.
 */
function normalize(value: string): string {
  return value.replace(/ي/g, 'ی').replace(/ك/g, 'ک');
}

function toNumber(value: string): number {
  return Number(String(value).replace(/,/g, ''));
}

function getSource(description: string): UncompletePaymentSource {
  const normalized = normalize(description);

  if (normalized.includes('کارت')) {
    return UncompletePaymentSource.CARD;
  }

  if (normalized.includes('اینترنت')) {
    return UncompletePaymentSource.ONLINE;
  }

  return UncompletePaymentSource.UNKNOWN;
}

function convertPayment(
  r: Record<string, string>,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: getSource(r['__EMPTY_8'] ?? ''),
    paidAt: date(`${r['__EMPTY_1']} ${r['__EMPTY_2']}`, {
      jalali: true,
    }).format('YYYY-MM-DD HH:mm:ss'),
    description: r['__EMPTY_8'] ?? '',
    amount: getPrice(toNumber(r['__EMPTY_5'])),
    remain: getPrice(toNumber(r['__EMPTY_10'])),
    type: UncompletePaymentType.PAYMENT,
  };
}

function convertIncome(
  r: Record<string, string>,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: getSource(r['__EMPTY_8'] ?? ''),
    paidAt: date(`${r['__EMPTY_1']} ${r['__EMPTY_2']}`, {
      jalali: true,
    }).format('YYYY-MM-DD HH:mm:ss'),
    description: r['__EMPTY_8'] ?? '',
    amount: getPrice(toNumber(r['__EMPTY_5'])),
    remain: getPrice(toNumber(r['__EMPTY_10'])),
    type: UncompletePaymentType.INCOME,
  };
}
