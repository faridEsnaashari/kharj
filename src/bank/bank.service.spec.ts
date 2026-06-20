import { ConflictException, NotFoundException } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankRepository } from './entities/repositories/bank.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';

describe('BankService', () => {
  let service: BankService;
  let bankRepository: MockRepository;
  let accountRepository: MockRepository;
  const user = { id: 1 } as User;

  beforeEach(() => {
    bankRepository = createMockRepository();
    accountRepository = createMockRepository();
    service = new BankService(
      bankRepository as unknown as BankRepository,
      accountRepository as unknown as AccountRepository,
    );
  });

  describe('findAllBanks', () => {
    it('returns whatever the repository finds (general + own)', async () => {
      const banks = [{ id: 1 }, { id: 2 }];
      bankRepository.findAll.mockResolvedValue(banks);

      await expect(service.findAllBanks(user)).resolves.toBe(banks);
    });
  });

  describe('findOneBank', () => {
    it('throws NotFoundException when not found', async () => {
      bankRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneBank(1, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createBank', () => {
    it('throws ConflictException when symbol already exists', async () => {
      bankRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.createBank({ name: 'Resalat', symbol: 'RESALAT' }, user),
      ).rejects.toThrow(ConflictException);
    });

    it('creates the bank scoped to the user', async () => {
      bankRepository.findOne.mockResolvedValue(null);
      bankRepository.create.mockResolvedValue({ id: 5 });

      await service.createBank({ name: 'My Bank', symbol: 'MYBANK' }, user);

      expect(bankRepository.create).toHaveBeenCalledWith({
        name: 'My Bank',
        symbol: 'MYBANK',
        userId: user.id,
      });
    });
  });

  describe('updateBank', () => {
    it('throws NotFoundException when not owned by the user', async () => {
      bankRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateBank(1, { name: 'X', symbol: 'X' }, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException on symbol collision', async () => {
      bankRepository.findOne
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });

      await expect(
        service.updateBank(1, { name: 'X', symbol: 'X' }, user),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteBank', () => {
    it('throws ConflictException when still used by an account', async () => {
      bankRepository.findOne.mockResolvedValue({ id: 1 });
      accountRepository.findAll.mockResolvedValue([{ id: 10 }]);

      await expect(service.deleteBank(1, user)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deletes the bank when unused', async () => {
      bankRepository.findOne.mockResolvedValue({ id: 1 });
      accountRepository.findAll.mockResolvedValue([]);

      const result = await service.deleteBank(1, user);

      expect(bankRepository.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });
});
