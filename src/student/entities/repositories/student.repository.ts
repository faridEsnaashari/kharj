import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateStudent,
  Student,
  StudentModel,
  UpdateStudent,
} from '../student.entity';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Paginated } from 'src/common/types/pagination.type';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectModel(StudentModel)
    private studentModel: typeof StudentModel,
  ) {}

  async create(student: CreateStudent, raw = true): Promise<Student> {
    const result = await this.studentModel.create(student);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async pagination(
    conditions: FindOptions<Student> | WhereOptions<Student>,
    raw = true,
  ): Promise<Paginated<Student>> {
    const result = await this.studentModel.findAndCountAll({
      where: !('where' in conditions)
        ? (conditions as UpdateStudent)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findAll(
    conditions: FindOptions<Student> | WhereOptions<Student>,
    raw = true,
  ): Promise<Student[]> {
    const result = await this.studentModel.findAll({
      where: !('where' in conditions)
        ? (conditions as UpdateStudent)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOne(
    conditions: FindOptions<Student> | WhereOptions<Student>,
    raw = true,
  ): Promise<Student | null> {
    const result = await this.studentModel.findOne({
      where: !('where' in conditions)
        ? (conditions as UpdateStudent)
        : undefined,
      ...conditions,
    });

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async updateOneById(
    data: UpdateStudent,
    id: Student['id'],
  ): Promise<undefined> {
    await this.studentModel.update(data, { where: { id } });
  }

  async findOneById(id: Student['id'], raw = true): Promise<Student | null> {
    const result = await this.studentModel.findByPk(id);

    if (raw) {
      return JSON.parse(JSON.stringify(result));
    }

    return result;
  }

  async findOneByIdOrFail(id: Student['id'], raw = true): Promise<Student> {
    const result = await this.findOneById(id, raw);

    if (!result) {
      throw new NotFoundException('student not found');
    }

    return result;
  }
}
