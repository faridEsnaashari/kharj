import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UncompletePaymentService } from './uncomplete-payment.service';
import { UncompletePaymentRepository } from './entities/repositories/uncomplete-payment.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import { BankRepository } from 'src/bank/entities/repositories/bank.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';
import * as xlsxLogic from 'src/file/logics/xlsx.logic';
import * as resalatTextLogic from './logics/resalat/convert-resalat-text.logic';
import * as resalatXlsxLogic from './logics/resalat/convert-resalat-xlsx.logic';
import * as pasargadTextLogic from './logics/pasargad/convert-pasargad-text.logic';
import * as pasargadXlsxLogic from './logics/pasargad/convert-pasargad-xlsx.logic';
import * as melyXlsxLogic from './logics/mely/convert-mely-xlsx.logic';

jest.mock('src/file/logics/xlsx.logic');
jest.mock('./logics/resalat/convert-resalat-text.logic');
jest.mock('./logics/resalat/convert-resalat-xlsx.logic');
jest.mock('./logics/pasargad/convert-pasargad-text.logic');
jest.mock('./logics/pasargad/convert-pasargad-xlsx.logic');
jest.mock('./logics/mely/convert-mely-xlsx.logic');

describe('UncompletePaymentService', () => {
  let service: UncompletePaymentService;
  let uncompletePaymentRepository: MockRepository;
  let accountRepository: MockRepository;
  let bankRepository: MockRepository;
  const user = { id: 1 } as User;

  beforeEach(() => {
    jest.clearAllMocks();
    uncompletePaymentRepository = createMockRepository();
    accountRepository = createMockRepository();
    bankRepository = createMockRepository();

    service = new UncompletePaymentService(
      uncompletePaymentRepository as unknown as UncompletePaymentRepository,
      accountRepository as unknown as AccountRepository,
      bankRepository as unknown as BankRepository,
    );
  });

  describe('uploadBandExport', () => {
    const dto = { bankId: 10, uploadedFile: 'file.xlsx' };

    it('throws NotFoundException when no account matches the bank', async () => {
      accountRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadBandExport(dto, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws when the bank id does not exist', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockRejectedValue(
        new NotFoundException('bank not found'),
      );

      await expect(service.uploadBandExport(dto, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws UnprocessableEntityException when the file cannot be parsed', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'RESALAT',
      });
      (xlsxLogic.xlsxToJson as jest.Mock).mockReturnValue(null);

      await expect(service.uploadBandExport(dto, user)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('throws UnprocessableEntityException when the bank has no known parser', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'OTHER',
      });
      (xlsxLogic.xlsxToJson as jest.Mock).mockReturnValue([{}]);

      await expect(service.uploadBandExport(dto, user)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('parses via the Resalat converter and bulk-creates with the account id attached', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'RESALAT',
      });
      (xlsxLogic.xlsxToJson as jest.Mock).mockReturnValue([{ a: 1 }]);
      (resalatXlsxLogic.convertResalatXlsx as jest.Mock).mockReturnValue([
        { amount: 10 },
        { amount: 20 },
      ]);
      uncompletePaymentRepository.bulkCreate.mockResolvedValue([]);

      await service.uploadBandExport(dto, user);

      expect(uncompletePaymentRepository.bulkCreate).toHaveBeenCalledWith([
        { amount: 10, accountId: 1 },
        { amount: 20, accountId: 1 },
      ]);
    });

    it('parses via the Pasargad xlsx converter and bulk-creates with the account id attached', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'PASARGAD',
      });
      (xlsxLogic.xlsxToJson as jest.Mock).mockReturnValue([{ a: 1 }]);
      (pasargadXlsxLogic.convertPasargadXlsx as jest.Mock).mockReturnValue([
        { amount: 30 },
      ]);
      uncompletePaymentRepository.bulkCreate.mockResolvedValue([]);

      await service.uploadBandExport(dto, user);

      expect(uncompletePaymentRepository.bulkCreate).toHaveBeenCalledWith([
        { amount: 30, accountId: 1 },
      ]);
    });

    it('parses via the Mely converter and bulk-creates with the account id attached', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'MELY',
      });
      (xlsxLogic.xlsxToJson as jest.Mock).mockReturnValue([{ a: 1 }]);
      (melyXlsxLogic.convertMelyXlsx as jest.Mock).mockReturnValue([
        { amount: 40 },
      ]);
      uncompletePaymentRepository.bulkCreate.mockResolvedValue([]);

      await service.uploadBandExport(dto, user);

      expect(uncompletePaymentRepository.bulkCreate).toHaveBeenCalledWith([
        { amount: 40, accountId: 1 },
      ]);
    });
  });

  describe('paymentText', () => {
    const dto = { bankId: 10, text: 'sms text' };

    it('throws NotFoundException when no account matches the bank', async () => {
      accountRepository.findOne.mockResolvedValue(null);

      await expect(service.paymentText(dto, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws when the bank id does not exist', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockRejectedValue(
        new NotFoundException('bank not found'),
      );

      await expect(service.paymentText(dto, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws UnprocessableEntityException for a non-Resalat bank', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'OTHER',
      });

      await expect(service.paymentText(dto, user)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('parses via the Resalat converter and creates with the account id attached', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'RESALAT',
      });
      (resalatTextLogic.convertResalatText as jest.Mock).mockReturnValue({
        amount: 15,
      });
      uncompletePaymentRepository.create.mockResolvedValue({ id: 1 });

      await service.paymentText(dto, user);

      expect(uncompletePaymentRepository.create).toHaveBeenCalledWith({
        amount: 15,
        accountId: 1,
      });
    });

    it('parses via the Pasargad converter and creates with the account id attached', async () => {
      accountRepository.findOne.mockResolvedValue({ id: 1 });
      bankRepository.findOneByIdOrFail.mockResolvedValue({
        id: 10,
        symbol: 'PASARGAD',
      });
      (pasargadTextLogic.convertPasargadText as jest.Mock).mockReturnValue({
        amount: 25,
      });
      uncompletePaymentRepository.create.mockResolvedValue({ id: 1 });

      await service.paymentText(dto, user);

      expect(uncompletePaymentRepository.create).toHaveBeenCalledWith({
        amount: 25,
        accountId: 1,
      });
    });
  });

  describe('getAllUncompletePayments', () => {
    it('scopes the lookup to the requesting user and paginates', async () => {
      accountRepository.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      uncompletePaymentRepository.pagination.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const query = { page: 1, size: 20 } as never;

      await service.getAllUncompletePayments(query, user);

      expect(accountRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 1 } }),
      );
      expect(uncompletePaymentRepository.pagination).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ accountId: [1, 2] }),
        }),
        { page: 1, size: 20 },
      );
    });

    it('narrows accounts by bankId when provided', async () => {
      accountRepository.findAll.mockResolvedValue([{ id: 1 }]);
      uncompletePaymentRepository.pagination.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const query = { page: 1, size: 20, bankId: 10 } as never;

      await service.getAllUncompletePayments(query, user);

      expect(accountRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { userId: 1, bankId: 10 } }),
      );
    });
  });

  describe('deleteUncompletePayment', () => {
    it('throws NotFoundException when the account does not belong to the user', async () => {
      uncompletePaymentRepository.findOneByIdOrFail.mockResolvedValue({
        id: 1,
        accountId: 5,
      });
      accountRepository.findOne.mockResolvedValue(null);

      await expect(
        service.deleteUncompletePayment({ id: 1 }, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('deletes when ownership checks out', async () => {
      uncompletePaymentRepository.findOneByIdOrFail.mockResolvedValue({
        id: 1,
        accountId: 5,
      });
      accountRepository.findOne.mockResolvedValue({ id: 5 });
      uncompletePaymentRepository.deleteById.mockResolvedValue(1);

      await service.deleteUncompletePayment({ id: 1 }, user);

      expect(uncompletePaymentRepository.deleteById).toHaveBeenCalledWith(1);
    });
  });
});
