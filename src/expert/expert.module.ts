import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpertController } from './expert.controller';
import { ExpertModel } from './entities/expert.entity';
import { ExpertService } from './expert.service';
import { ExpertRepository } from './entities/repositories/expert.repository';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [SequelizeModule.forFeature([ExpertModel]), AuthModule],
  providers: [ExpertService, ExpertRepository],
  controllers: [ExpertController],
  exports: [ExpertRepository],
})
export class ExpertModule {}
