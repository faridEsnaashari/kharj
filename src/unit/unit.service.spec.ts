import { ConflictException, NotFoundException } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitRepository } from './entities/repositories/unit.repository';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/test-utils/mock-repository';
import { User } from 'src/user/entities/user.entity';

describe('UnitService', () => {
  let service: UnitService;
  let unitRepository: MockRepository;
  let accountRepository: MockRepository;
  const user = { id: 1 } as User;

  beforeEach(() => {
    unitRepository = createMockRepository();
    accountRepository = createMockRepository();
    service = new UnitService(
      unitRepository as unknown as UnitRepository,
      accountRepository as unknown as AccountRepository,
    );
  });

  describe('findAllUnits', () => {
    it('returns whatever the repository finds (general + own)', async () => {
      const units = [{ id: 1 }, { id: 2 }];
      unitRepository.findAll.mockResolvedValue(units);

      const result = await service.findAllUnits(user);

      expect(result).toBe(units);
      expect(unitRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneUnit', () => {
    it('throws NotFoundException when not found', async () => {
      unitRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneUnit(1, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the unit when found', async () => {
      const unit = { id: 1, symbol: 'USD' };
      unitRepository.findOne.mockResolvedValue(unit);

      await expect(service.findOneUnit(1, user)).resolves.toBe(unit);
    });
  });

  describe('createUnit', () => {
    it('throws ConflictException when symbol already exists', async () => {
      unitRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.createUnit({ name: 'Dollar', symbol: 'USD' }, user),
      ).rejects.toThrow(ConflictException);
    });

    it('creates the unit scoped to the user', async () => {
      unitRepository.findOne.mockResolvedValue(null);
      unitRepository.create.mockResolvedValue({ id: 5 });

      await service.createUnit({ name: 'Dollar', symbol: 'USD' }, user);

      expect(unitRepository.create).toHaveBeenCalledWith({
        name: 'Dollar',
        symbol: 'USD',
        userId: user.id,
      });
    });
  });

  describe('updateUnit', () => {
    it('throws NotFoundException when the unit is not owned by the user', async () => {
      unitRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateUnit(1, { name: 'Dollar', symbol: 'USD' }, user),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when the symbol collides with another unit', async () => {
      unitRepository.findOne
        .mockResolvedValueOnce({ id: 1 }) // ownership check
        .mockResolvedValueOnce({ id: 2 }); // symbol collision check

      await expect(
        service.updateUnit(1, { name: 'Dollar', symbol: 'USD' }, user),
      ).rejects.toThrow(ConflictException);
    });

    it('updates and returns the unit', async () => {
      unitRepository.findOne
        .mockResolvedValueOnce({ id: 1 }) // ownership check
        .mockResolvedValueOnce(null) // no collision
        .mockResolvedValueOnce({ id: 1, name: 'Dollar', symbol: 'USD' }); // final findOneUnit

      const result = await service.updateUnit(
        1,
        { name: 'Dollar', symbol: 'USD' },
        user,
      );

      expect(unitRepository.updateOneById).toHaveBeenCalledWith(
        { name: 'Dollar', symbol: 'USD' },
        1,
      );
      expect(result).toEqual({ id: 1, name: 'Dollar', symbol: 'USD' });
    });
  });

  describe('deleteUnit', () => {
    it('throws NotFoundException when not owned by the user', async () => {
      unitRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUnit(1, user)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when still used by an account', async () => {
      unitRepository.findOne.mockResolvedValue({ id: 1 });
      accountRepository.findAll.mockResolvedValue([{ id: 10 }]);

      await expect(service.deleteUnit(1, user)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deletes the unit when unused', async () => {
      unitRepository.findOne.mockResolvedValue({ id: 1 });
      accountRepository.findAll.mockResolvedValue([]);

      const result = await service.deleteUnit(1, user);

      expect(unitRepository.deleteById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1 });
    });
  });
});
