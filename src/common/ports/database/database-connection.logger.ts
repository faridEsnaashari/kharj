import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseConnectionLogger implements OnApplicationBootstrap {
  private readonly logger = new Logger('Database');

  constructor(private readonly sequelize: Sequelize) {}

  onApplicationBootstrap(): void {
    const { host, port, database } = this.sequelize.config;

    this.logger.log(`MySQL connected: ${host}:${port}/${database}`);
  }
}
