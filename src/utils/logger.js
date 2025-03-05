const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors, json } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        json()
    ),
    transports: [
        new transports.Console({
            format: combine(format.colorize(), logFormat)
        }),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: combine(timestamp(), json())
        }),
        new transports.File({
            filename: 'logs/combined.log',
            format: combine(timestamp(), json())
        })
    ]
});

module.exports = logger;
