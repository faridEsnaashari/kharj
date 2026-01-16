import { date } from 'src/common/tools/date/date.tool';
import { PaymentSource } from 'src/payment/enums/payment-source.enum';
import { getPrice } from '../payment.logic';
import { CreateUncompeletePayment } from 'src/payment/entities/uncompelete-payment.entity';

export function convertResalatText(
  text: string,
): Omit<CreateUncompeletePayment, 'accountId'> {
  return {
    source: PaymentSource.SMS,
    paidAt: date(
      `${date().calendar('jalali').year()}-${text.split(`\n`)[2].slice(0, 2)}-${text.split(`\n`)[2].slice(3, 5)} ${text.split(`\n`)[2].split('_')[1]}`,
      {
        jalali: true,
      },
    ).format('YYYY-MM-DD HH:mm:ss'),
    amount: +text.split(`\n`)[1].split(',').join('').split('-')[1],
    remain: getPrice(
      +text.split(`\n`)[3].split(':')[1].split(',').join('') / 1000,
    ),
    description: '',
  };
}
