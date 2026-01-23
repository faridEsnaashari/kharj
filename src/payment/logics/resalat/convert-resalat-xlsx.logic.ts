import { date } from 'src/common/tools/date/date.tool';
import { PaymentSource } from 'src/payment/enums/payment-source.enum';
import { getPrice } from '../payment.logic';
import { CreateUncompeletePayment } from 'src/payment/entities/uncompelete-payment.entity';

export function convertResalatXlsx(
  xlsx: Record<string, string>[],
): Omit<CreateUncompeletePayment, 'accountId'>[] {
  return xlsx
    .slice(2)
    .reverse()
    .slice(1)
    .reverse()
    .filter((r) => (r['__EMPTY_8'] as unknown as number) !== 0)
    .map((r) => ({
      source: getSource(r['__EMPTY_1']),
      paidAt: date(`${r['__EMPTY_2']} ${r['__EMPTY_3']}`, {
        jalali: true,
      }).format('YYYY-MM-DD HH:mm:ss'),
      referingCode: r['__EMPTY_4'],
      description: r['__EMPTY_7'],
      amount: getPrice(r['__EMPTY_8'] as unknown as number),
      remain: getPrice(r['__EMPTY_10'] as unknown as number),
    }));
}

function getSource(source: string): PaymentSource {
  if (source === 'کارت') {
    return PaymentSource.CARD;
  }

  if (source === 'ستاد') {
    return PaymentSource.ONLINE;
  }

  return PaymentSource.UNKNOWN;
}
