import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './entities/repositories/teacher.repository';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { UpdateTeacherDto } from './dtos/update-teacher.dto';
import { FindAllTeacherDto } from './dtos/find-all-teacher.dto';
import { Paginated } from 'src/common/types/pagination.type';
import { jsonToXlsx } from 'src/common/file/xlsx.logic';
import { createSearchObject } from 'src/common/ports/database/helpers.tool';
import { getFileUrl } from 'src/common/file/files.logic';

@Injectable()
export class TeacherService {
  constructor(private teacherRepository: TeacherRepository) {}

  async createTeacher(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teacherRepository.create(createTeacherDto);
  }

  async updateTeacher(updateTeacherDto: UpdateTeacherDto, id: number) {
    return this.teacherRepository.updateOneById(updateTeacherDto, id);
  }

  async findOneTeacher(id: number) {
    return this.teacherRepository.findOneById(id);
  }

  async findAllTeacher(query: FindAllTeacherDto): Promise<Paginated<Teacher>> {
    const { limit, page, q, ...where } = query;
    const searchObject = createSearchObject<Teacher>(q || '', [
      'firstName',
      'lastName',
      'phone',
      'nationalCode',
    ]);
    return this.teacherRepository.pagination({
      where: { ...searchObject, ...where },
      limit: +limit,
      offset: +page - 1,
    });
  }

  async exportAllTeacher(query: FindAllTeacherDto): Promise<string> {
    const data = await this.findAllTeacher(query);
    const path = await jsonToXlsx(data.rows);

    if (!path) {
      throw new Error();
    }

    return getFileUrl(path);
  }
}
