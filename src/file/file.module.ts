import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
//import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
