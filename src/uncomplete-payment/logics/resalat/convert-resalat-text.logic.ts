import { date } from 'src/common/tools/date/date.tool';
import { getPrice } from 'src/payment/logics/payment.logic';
import { CreateUncompletePayment } from 'src/uncomplete-payment/entities/uncomplete-payment.entity';
import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';

export function convertResalatText(
  text: string,
): Omit<CreateUncompletePayment, 'accountId'> {
  const isMinus = text.split(`\n`)[1].split(',').join('').split('-')[1];
  if (isMinus) {
    return convertPayment(text);
  }

  return convertIncome(text);
}

function convertIncome(
  text: string,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: UncompletePaymentSource.SMS,
    paidAt: date(
      `${date().calendar('jalali').year()}-${text.split(`\n`)[2].slice(0, 2)}-${text.split(`\n`)[2].slice(3, 5)} ${text.split(`\n`)[2].split('_')[1]}`,
      {
        jalali: true,
      },
    ).format('YYYY-MM-DD HH:mm:ss'),
    amount: getPrice(+text.split(`\n`)[1].split(',').join('').split('+')[1]),
    remain: +text.split(`\n`)[3].split(':')[1].split(',').join(''),
    description: '',
    type: UncompletePaymentType.INCOME,
  };
}

function convertPayment(
  text: string,
): Omit<CreateUncompletePayment, 'accountId'> {
  return {
    source: UncompletePaymentSource.SMS,
    paidAt: date(
      `${date().calendar('jalali').year()}-${text.split(`\n`)[2].slice(0, 2)}-${text.split(`\n`)[2].slice(3, 5)} ${text.split(`\n`)[2].split('_')[1]}`,
      {
        jalali: true,
      },
    ).format('YYYY-MM-DD HH:mm:ss'),
    amount: getPrice(+text.split(`\n`)[1].split(',').join('').split('-')[1]),
    remain: +text.split(`\n`)[3].split(':')[1].split(',').join(''),
    description: '',
    type: UncompletePaymentType.PAYMENT,
  };
}
