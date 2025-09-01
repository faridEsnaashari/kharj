import { Injectable } from '@nestjs/common';
import { ExpertRepository } from './entities/repositories/expert.repository';
import { CreateExpertDto } from './dtos/create-expert.dto';
import { Expert } from './entities/expert.entity';
import { UpdateExpertDto } from './dtos/update-expert.dto';
import { FindAllExpertDto } from './dtos/find-all-expert.dto';
import { Paginated } from 'src/common/types/pagination.type';
import { jsonToXlsx } from 'src/common/file/xlsx.logic';
import { createSearchObject } from 'src/common/ports/database/helpers.tool';
import { getFileUrl } from 'src/common/file/files.logic';

@Injectable()
export class ExpertService {
  constructor(private expertRepository: ExpertRepository) {}

  async createExpert(createExpertDto: CreateExpertDto): Promise<Expert> {
    return this.expertRepository.create(createExpertDto);
  }

  async updateExpert(updateExpertDto: UpdateExpertDto, id: number) {
    return this.expertRepository.updateOneById(updateExpertDto, id);
  }

  async findOneExpert(id: number) {
    return this.expertRepository.findOneById(id);
  }

  async findAllExpert(query: FindAllExpertDto): Promise<Paginated<Expert>> {
    const { limit, page, q, ...where } = query;
    const searchObject = createSearchObject<Expert>(q || '', [
      'firstName',
      'lastName',
      'phone',
      'nationalCode',
    ]);
    return this.expertRepository.pagination({
      where: { ...searchObject, ...where },
      limit: +limit,
      offset: +page - 1,
    });
  }

  async exportAllExpert(query: FindAllExpertDto): Promise<string> {
    const data = await this.findAllExpert(query);
    const path = await jsonToXlsx(data.rows);

    if (!path) {
      throw new Error();
    }

    return getFileUrl(path);
  }
}
