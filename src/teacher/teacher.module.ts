import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeacherController } from './teacher.controller';
import { TeacherModel } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';
import { TeacherRepository } from './entities/repositories/teacher.repository';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([TeacherModel]), AuthModule],
  providers: [TeacherService, TeacherRepository],
  controllers: [TeacherController],
  exports: [TeacherRepository],
})
export class TeacherModule {}
