import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/ports/database/database.module';
import { PinoModule } from './common/tools/pino/pino.module';
import { ManagerModule } from './manager/manager.module';
import { AuthModule } from './auth/auth.module';
import { ExpertModule } from './expert/expert.module';
import { TeacherModule } from './teacher/teacher.module';
import { FieldOfStudyModule } from './field-of-study/field-of-study.module';
import { StudentModule } from './student/student.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    DatabaseModule,
    PinoModule,
    ManagerModule,
    AuthModule,
    ExpertModule,
    TeacherModule,
    FieldOfStudyModule,
    StudentModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
