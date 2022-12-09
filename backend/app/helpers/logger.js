const winston = require("winston");
// const debugFormat = require("winston-format-debug");
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
        filename: '../logs/re-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format.colorize({ message: true })
        ),
    });

const logger = winston.createLogger({
    transports: [
        transport,
        new winston.transports.Console()
    ]
});
logger.info("Logger Initiated");

module.exports = {logger};
