import { UncompletePaymentSource } from 'src/uncomplete-payment/enums/uncomplete-payment-source.enum';
import { UncompletePaymentType } from 'src/uncomplete-payment/enums/uncomplete-payment-type.enum';
import {
  convertPasargadXlsx,
  PasargadBillRow,
} from './convert-pasargad-xlsx.logic';

describe('convertPasargadXlsx', () => {
  it('maps a debtor:false row to a PAYMENT and converts the UTC timestamp to Tehran time', () => {
    const rows: PasargadBillRow[] = [
      {
        issuanceDate: '2026-07-18T16:15:42.491+00:00',
        amount: 1100000,
        debtor: false,
        afterTxAmount: 50388259,
        description:
          'سند خرید کالا با اعتبار - سند تراکنش کارت - خريد کالا و خدمات با کارت',
      },
    ];

    const [result] = convertPasargadXlsx(rows);

    expect(result).toEqual({
      source: UncompletePaymentSource.CARD,
      paidAt: '2026-07-18 19:45:42',
      description: rows[0].description,
      amount: 110,
      remain: 5038,
      type: UncompletePaymentType.PAYMENT,
    });
  });

  it('maps a debtor:true row to an INCOME', () => {
    const rows: PasargadBillRow[] = [
      {
        issuanceDate: '2026-07-19T05:58:08.617+00:00',
        amount: 10000,
        debtor: true,
        afterTxAmount: 50398259,
        description: 'سند افزایش اعتبار کاربر - سند تراکنش کارت',
      },
    ];

    const [result] = convertPasargadXlsx(rows);

    expect(result.type).toBe(UncompletePaymentType.INCOME);
    expect(result.amount).toBe(1);
    expect(result.remain).toBe(5039);
  });

  it('maps description keywords to ONLINE and falls back to UNKNOWN', () => {
    const rows: PasargadBillRow[] = [
      {
        issuanceDate: '2026-07-18T07:46:02.681+00:00',
        amount: 150000000,
        debtor: false,
        afterTxAmount: 56738259,
        description: 'انتقال وجه به سپرده از اینترنت بانک',
      },
      {
        issuanceDate: '2026-07-18T07:46:02.681+00:00',
        amount: 200000,
        debtor: false,
        afterTxAmount: 56538259,
        description: 'انتقال وجه به سپرده',
      },
    ];

    const [online, unknown] = convertPasargadXlsx(rows);

    expect(online.source).toBe(UncompletePaymentSource.ONLINE);
    expect(unknown.source).toBe(UncompletePaymentSource.UNKNOWN);
  });

  it('maps each row in the input array independently', () => {
    const rows: PasargadBillRow[] = [
      {
        issuanceDate: '2026-07-19T06:12:39.664+00:00',
        amount: 1100000,
        debtor: false,
        afterTxAmount: 49298259,
        description: 'خرید با کارت',
      },
      {
        issuanceDate: '2026-07-19T05:58:08.617+00:00',
        amount: 10000,
        debtor: true,
        afterTxAmount: 50398259,
        description: 'افزایش اعتبار با کارت',
      },
    ];

    const result = convertPasargadXlsx(rows);

    expect(result).toHaveLength(2);
    expect(result[0].type).toBe(UncompletePaymentType.PAYMENT);
    expect(result[1].type).toBe(UncompletePaymentType.INCOME);
  });
});
