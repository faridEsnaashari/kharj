import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { UnitRepository } from './entities/repositories/unit.repository';
import { CreateUnitDto } from './dtos/create-unit.dto';
import { UpdateUnitDto } from './dtos/update-unit.dto';
import { GetAllUnitDto } from './dtos/get-all-unit.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AccountRepository } from 'src/account/entities/repositories/account.repository';

@Injectable()
export class UnitService {
  constructor(
    private unitRepository: UnitRepository,
    private accountRepository: AccountRepository,
    private userService: UserService,
  ) {}

  async findAllUnits(query: GetAllUnitDto, user: User) {
    const targetUserId = await this.userService.resolveTargetUserId(
      query.userId,
      user,
    );

    return this.unitRepository.findAll({
      [Op.or]: [{ userId: null }, { userId: targetUserId }],
    });
  }

  async findOneUnit(id: number, user: User) {
    const unit = await this.unitRepository.findOne({
      id,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (!unit) {
      throw new NotFoundException('unit-not-found');
    }

    return unit;
  }

  async createUnit(dto: CreateUnitDto, user: User) {
    const existing = await this.unitRepository.findOne({
      symbol: dto.symbol,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (existing) {
      throw new ConflictException('unit-exist');
    }

    return this.unitRepository.create({ ...dto, userId: user.id });
  }

  async updateUnit(id: number, dto: UpdateUnitDto, user: User) {
    const unit = await this.unitRepository.findOne({ id, userId: user.id });

    if (!unit) {
      throw new NotFoundException('unit-not-found');
    }

    const existing = await this.unitRepository.findOne({
      symbol: dto.symbol,
      [Op.or]: [{ userId: null }, { userId: user.id }],
    });

    if (existing && existing.id !== id) {
      throw new ConflictException('unit-exist');
    }

    await this.unitRepository.updateOneById(dto, id);

    return this.findOneUnit(id, user);
  }

  async deleteUnit(id: number, user: User) {
    const unit = await this.unitRepository.findOne({ id, userId: user.id });

    if (!unit) {
      throw new NotFoundException('unit-not-found');
    }

    const accountsUsingUnit = await this.accountRepository.findAll({
      unitId: id,
    });

    if (accountsUsingUnit.length > 0) {
      throw new ConflictException('unit-in-use');
    }

    await this.unitRepository.deleteById(id);

    return { id };
  }
}
