import { LoggerService } from '@nestjs/common';

/*
 * Nest's bootstrap logs every controller and route through the app logger
 * (contexts `RoutesResolver` and `RouterExplorer`), which floods startup
 * output. This wrapper drops info-level logs from those contexts and passes
 * everything else — including their warnings and errors — straight through.
 *
 * Add a context name to the set to silence another Nest subsystem
 * (e.g. 'InstanceLoader' for the per-module dependency lines).
 */
const suppressedContexts = new Set(['RoutesResolver', 'RouterExplorer']);

export class FilteredLogger implements LoggerService {
  constructor(private readonly inner: LoggerService) {}

  private isSuppressed(params: unknown[]): boolean {
    const context = params[params.length - 1];

    return typeof context === 'string' && suppressedContexts.has(context);
  }

  log(message: unknown, ...params: unknown[]): void {
    if (this.isSuppressed(params)) {
      return;
    }

    this.inner.log(message, ...params);
  }

  error(message: unknown, ...params: unknown[]): void {
    this.inner.error(message, ...params);
  }

  warn(message: unknown, ...params: unknown[]): void {
    this.inner.warn(message, ...params);
  }

  debug(message: unknown, ...params: unknown[]): void {
    if (this.inner.debug) {
      this.inner.debug(message, ...params);
    }
  }

  verbose(message: unknown, ...params: unknown[]): void {
    if (this.inner.verbose) {
      this.inner.verbose(message, ...params);
    }
  }
}
