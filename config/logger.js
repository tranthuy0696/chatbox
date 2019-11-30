const acceptedLevel = ['error', 'warn', 'info', 'verbose', 'debug', 'silly']
const defaultLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info'
const path = require('path')

module.exports = {
  logger: {
    enabled: process.env.PCN_PORTAL_LOG_ENABLED !== 'false',
    level: acceptedLevel.indexOf(process.env.PCN_PORTAL_LOG_LEVEL) != -1 ?
      process.env.PCN_PORTAL_LOG_LEVEL : defaultLevel,
    logDir: path.join('.', 'logs'),
    maxsize: (process.env.PCN_PORTAL_LOG_MAX_SIZE || 5) * 1048576, // 5MB,
    maxDays: (process.env.PCN_PORTAL_LOG_MAX_DAYS) || 365,
  },
}

