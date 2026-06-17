import { date } from 'src/common/tools/date/date.tool';
import { getPrice } from 'src/payment/logics/payment.logic';
import { CreateUncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

export function convertResalatXlsx(
  xlsx: Record<string, string>[],
): Omit<CreateUncompletePayment, 'accountId'>[] {
  return xlsx
    .slice(2)
    .reverse()
    .slice(1)
    .reverse()
    .map((r) => {
      if ((r['__EMPTY_8'] as unknown as number) !== 0) {
        return convertPayment(r);
      }

      return convertIncome(r);
    });
}

function getSource(source: string): UncompletePaymentSource {
  if (source === 'کارت') {
    return UncompletePaymentSource.CARD;
  }

  if (source === 'ستاد') {
    return UncompletePaymentSource.ONLINE;
  }

  return UncompletePaymentSource.UNKNOWN;
}

function convertPayment(
  r: Record<string, string>,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: getSource(r['__EMPTY_1']),
    paidAt: date(`${r['__EMPTY_2']} ${r['__EMPTY_3']}`, {
      jalali: true,
    }).format('YYYY-MM-DD HH:mm:ss'),
    description: r['__EMPTY_7'],
    amount: getPrice(r['__EMPTY_8'] as unknown as number),
    remain: getPrice(r['__EMPTY_10'] as unknown as number),
    type: UncompletePaymentType.PAYMENT,
  };
}

function convertIncome(
  r: Record<string, string>,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: getSource(r['__EMPTY_1']),
    paidAt: date(`${r['__EMPTY_2']} ${r['__EMPTY_3']}`, {
      jalali: true,
    }).format('YYYY-MM-DD HH:mm:ss'),
    description: r['__EMPTY_7'],
    amount: getPrice(r['__EMPTY_9'] as unknown as number),
    remain: getPrice(r['__EMPTY_10'] as unknown as number),
    type: UncompletePaymentType.INCOME,
  };
}
