import { Injectable } from '@nestjs/common';
import { FieldOfStudyRepository } from './entities/repositories/field-of-study.repository';
import { CreateFieldOfStudyDto } from './dtos/create-field-of-study.dto';
import { FieldOfStudy } from './entities/field-of-study.entity';
import { UpdateFieldOfStudyDto } from './dtos/update-field-of-study.dto';

@Injectable()
export class FieldOfStudyService {
  constructor(private fieldOfStudyRepository: FieldOfStudyRepository) {}

  async createFieldOfStudy(
    createFieldOfStudyDto: CreateFieldOfStudyDto,
  ): Promise<FieldOfStudy> {
    return this.fieldOfStudyRepository.create(createFieldOfStudyDto);
  }

  async updateFieldOfStudy(
    updateFieldOfStudyDto: UpdateFieldOfStudyDto,
    id: number,
  ) {
    return this.fieldOfStudyRepository.updateOneById(updateFieldOfStudyDto, id);
  }

  async findOneFieldOfStudy(id: number) {
    return this.fieldOfStudyRepository.findOneById(id);
  }

  async findAllFieldOfStudy(): Promise<FieldOfStudy[]> {
    return this.fieldOfStudyRepository.findAll({});
  }
}
