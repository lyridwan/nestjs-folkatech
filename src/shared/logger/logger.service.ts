import { Injectable, Scope } from '@nestjs/common';
import * as chalk from 'chalk';
import safeStringify from 'fast-safe-stringify';
import { Format } from 'logform';
import { inspect } from 'util';
import { createLogger, format, Logger, transports } from 'winston';

import { RequestContext } from '../request-context/request-context.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private context?: string;
  private logger: Logger;
  private format: any;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    const nestLikeColorScheme: Record<string, chalk.Chalk> = {
      info: chalk.greenBright,
      error: chalk.red,
      warn: chalk.yellow,
      debug: chalk.magentaBright,
      verbose: chalk.cyanBright,
    };

    this.format = (appName = 'NestWinston', options?: any): Format =>
      format.printf(({ context, level, timestamp, message, ms, ...meta }) => {
        const localeStringOptions = {
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          day: '2-digit',
          month: '2-digit',
        };

        if ('undefined' !== typeof timestamp) {
          // Only format the timestamp to a locale representation if it's ISO 8601 format. Any format
          // that is not a valid date string will throw, just ignore it (it will be printed as-is).
          try {
            if (timestamp === new Date(timestamp).toISOString()) {
              timestamp = new Date(timestamp).toLocaleString(
                undefined,
                localeStringOptions as Intl.DateTimeFormatOptions,
              );
            }
          } catch (error) {}
        }

        const color = nestLikeColorScheme[level] || ((text: string): string => text);

        const { stack, ...metas } = meta;
        const stringifiedMeta = safeStringify(metas);
        const formattedMeta = options?.prettyPrint
          ? inspect(JSON.parse(stringifiedMeta), { colors: true, depth: null })
          : stringifiedMeta;

        return (
          `${color(`[${appName}] ${process.pid}  -`)} ` +
          ('undefined' !== typeof timestamp ? `${timestamp} ` : '') +
          `${chalk.yellow(level.toUpperCase().padStart(7, ' '))} ` +
          ('undefined' !== typeof context ? `${chalk.yellow('[' + context + ']')} ` : '') +
          `${color(message)}` +
          ('undefined' !== typeof ms ? ` ${chalk.yellow(ms)}\n` : '') +
          `${stack ? stack : ''}\n` +
          `${formattedMeta}`
        );
      });

    this.logger = createLogger({
      transports: [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.timestamp(),
            format.ms(),
            this.format('Hakku-Dashboard', { prettyPrint: true }),
          ),
        }),
      ],
    });
  }

  error(ctx: RequestContext, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.error({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  warn(ctx: RequestContext, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.warn({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  debug(ctx: RequestContext, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.debug({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  verbose(ctx: RequestContext, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.verbose({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }

  log(ctx: RequestContext, message: string, meta?: Record<string, any>): Logger {
    const timestamp = new Date().toISOString();

    return this.logger.info({
      message,
      contextName: this.context,
      ctx,
      timestamp,
      ...meta,
    });
  }
}
