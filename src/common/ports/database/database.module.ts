import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { appConfigs } from 'src/app.configs';
import { DatabaseConnectionLogger } from './database-connection.logger';
import { databaseConfig } from './database.config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      logging:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.logging
          : databaseConfig.production.logging,
      timezone:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.timezone
          : databaseConfig.production.timezone,
      dialectOptions:
        appConfigs.nodeEnv === 'develop'
          ? databaseConfig.development.dialectOptions
          : databaseConfig.production.dialectOptions,
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
