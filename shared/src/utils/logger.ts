import winston from 'winston';

export const createLogger = (serviceName: string) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.File({
        filename: `${serviceName}-error.log`,
        level: 'error',
      }),
      new winston.transports.File({
        filename: `${serviceName}.log`,
      }),
    ],
  });
};

export const logger = createLogger('shared');

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
