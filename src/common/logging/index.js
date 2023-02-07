const winston = require("winston");
const expressWinston = require("express-winston");

const getTransports = () => {
  const transports = [
    new winston.transports.Console({
      colorize: true
    })
  ];
  return transports;
};

const requestLogger = expressWinston.logger({
  level: "info",
  transports: getTransports(),
  colorize: true,
  expressFormat: true,
  meta: true
});

const errorLogger = expressWinston.errorLogger({
  level: "error",
  transports: getTransports()
});

const date = new Date().toISOString();
const logFormat = winston.format.printf(function(info) {
  return `${date}-${info.level}: ${JSON.stringify(info.message, null, 4)}\n`;
});
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize(), logFormat)
    })
  ]
});

/**Initiate logger for the application */
module.exports = {
  requestLogger,
  errorLogger,
  error: logger.error.bind(logger),
  warn: logger.warn.bind(logger),
  info: logger.info.bind(),
  log: logger.log.bind(logger),
  verbose: logger.verbose.bind(logger),
  debug: logger.debug.bind(logger),
  silly: logger.silly.bind(logger)
};
