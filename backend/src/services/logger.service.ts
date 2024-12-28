import winston from "winston";
import { config } from "../config";

export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: config.logging.level,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.File({
          filename: config.logging.file,
          level: "error",
        }),
        new winston.transports.File({
          filename: config.logging.file,
        }),
      ],
    });

    // Add console logging in development
    if (config.env !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
      );
    }
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }
}

export const logger = new LoggerService();
