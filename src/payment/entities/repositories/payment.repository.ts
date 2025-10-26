import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePayment,
  Payment,
  PaymentModel,
  UpdatePayment,
} from '../payment.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(PaymentModel)
    private paymentModel: typeof PaymentModel,
  ) {}

  async create(payment: CreatePayment, raw = true): Promise<Payment> {
    const result = await this.paymentModel.create(payment);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async pagination(
    conditions: FindOptions<Payment> | WhereOptions<Payment>,
    raw = true,
  ): Promise<Paginated<Payment>> {
    const result = await this.paymentModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdatePayment)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findAll(
    conditions: FindOptions<Payment> | WhereOptions<Payment>,
    raw = true,
  ): Promise<Payment[]> {
    const result = await this.paymentModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdatePayment)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOne(
    conditions: FindOptions<Payment> | WhereOptions<Payment>,
    raw = true,
  ): Promise<Payment | null> {
    const result = await this.paymentModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdatePayment)
        : undefined,
      ...conditions,
    });
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async updateOneById(data: UpdatePayment, id: Payment['id']): Promise<void> {
    await this.paymentModel.update(data, { where: { id } });
  }

  async findOneById(id: Payment['id'], raw = true): Promise<Payment | null> {
    const result = await this.paymentModel.findByPk(id);
    return raw ? JSON.parse(JSON.stringify(result)) : result;
  }

  async findOneByIdOrFail(id: Payment['id'], raw = true): Promise<Payment> {
    const result = await this.findOneById(id, raw);
    if (!result) throw new NotFoundException('Payment not found');
    return result;
  }
}
