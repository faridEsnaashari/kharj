import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTeacher,
  Teacher,
  TeacherModel,
  UpdateTeacher,
} from '../teacher.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class TeacherRepository {
  constructor(
    @InjectModel(TeacherModel)
    private teacherModel: typeof TeacherModel,
  ) {}

  async create(teacher: CreateTeacher, raw = true): Promise<Teacher> {
    const result = await this.teacherModel.create(teacher);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async pagination(
    conditions: FindOptions<Teacher> | WhereOptions<Teacher>,
    raw = true,
  ): Promise<Paginated<Teacher>> {
    const result = await this.teacherModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateTeacher)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findAll(
    conditions: FindOptions<Teacher> | WhereOptions<Teacher>,
    raw = true,
  ): Promise<Teacher[]> {
    const result = await this.teacherModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateTeacher)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<Teacher> | WhereOptions<Teacher>,
    raw = true,
  ): Promise<Teacher | null> {
    const result = await this.teacherModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateTeacher)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async updateOneById(
    data: UpdateTeacher,
    id: Teacher['id'],
  ): Promise<undefined> {
    await this.teacherModel.update(data, { where: { id } });
  }

  async findOneById(id: Teacher['id'], raw = true): Promise<Teacher | null> {
    const result = await this.teacherModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneByIdOrFail(id: Teacher['id'], raw = true): Promise<Teacher> {
    const result = await this.findOneById(id, raw);

    if (!result) {
      throw new NotFoundException('teacher not found');
    }

    return result;
  }
}
