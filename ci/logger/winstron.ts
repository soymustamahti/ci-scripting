import { createLogger, format, transports, Logger } from "winston";

const logger: Logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.json(),
    format.colorize({ all: true }),
    format.simple()
  ),
  transports: [
    new transports.File({ filename: "ci/logger/error.log", level: "error" }),
    new transports.File({ filename: "ci/logger/info.log", level: "info" }),
    new transports.Console(),
  ],
});
export default logger;
