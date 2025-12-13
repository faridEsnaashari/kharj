import { Logger as NestLogger } from '@nestjs/common';

export class Logger extends NestLogger {
  constructor(context: string) {
    super(context);
  }

  error(log: { key: string; data: object | unknown }) {
    super.error(log);
  }

  debug(log: { key: string; data: object | unknown }) {
    super.debug(log);
  }

  log(log: { key: string; data: object | unknown }) {
    super.log(log);
  }

  verbose(log: { key: string; data: object | unknown }) {
    super.verbose(log);
  }

  warn(log: { key: string; data: object | unknown }) {
    super.warn(log);
  }
}
