import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './sequelize-cli.config';
import { appConfigs } from 'src/app.configs';
import { DatabaseConnectionLogger } from './database-connection.logger';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.host
          : databaseConfig.production.host,
      port:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.port
          : databaseConfig.production.port,
      username:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.username
          : databaseConfig.production.username,
      password:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.password
          : databaseConfig.production.password,
      database:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.database
          : databaseConfig.production.database,

      models: [],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  providers: [DatabaseConnectionLogger],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
