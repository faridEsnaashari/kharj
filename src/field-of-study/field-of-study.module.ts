import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FieldOfStudyController } from './field-of-study.controller';
import { FieldOfStudyModel } from './entities/field-of-study.entity';
import { FieldOfStudyService } from './field-of-study.service';
import { FieldOfStudyRepository } from './entities/repositories/field-of-study.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([FieldOfStudyModel]), AuthModule],
  providers: [FieldOfStudyService, FieldOfStudyRepository],
  controllers: [FieldOfStudyController],
  exports: [FieldOfStudyRepository],
})
export class FieldOfStudyModule {}
