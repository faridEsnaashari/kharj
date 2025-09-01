import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { AuthModule } from 'src/auth/auth.module';
import { UploadedFileModule } from 'src/uploaded-file/uploaded-file.module';
import { StudentModel } from 'src/student/entities/student.entity';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([StudentModel]),
    AuthModule,
    UploadedFileModule,
  ],
  providers: [SiteService],
  controllers: [SiteController],
})
export class SiteModule {}
