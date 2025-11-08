import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "debug",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

// En un entorno de producción, enviar logs a un servicio externo
// if (process.env.NODE_ENV === 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.json(), // JSON para logs de producción
//     level: 'info'
//   }));
// }

export default logger;
