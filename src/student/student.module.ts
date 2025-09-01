import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentController } from './student.controller';
import { StudentModel } from './entities/student.entity';
import { StudentService } from './student.service';
import { StudentRepository } from './entities/repositories/student.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UploadedFileModule } from 'src/uploaded-file/uploaded-file.module';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([StudentModel]),
    AuthModule,
    UploadedFileModule,
  ],
  providers: [StudentService, StudentRepository],
  controllers: [StudentController],
  exports: [StudentRepository],
})
export class StudentModule {}
