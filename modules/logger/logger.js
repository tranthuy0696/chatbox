const winston = require('winston');
require('winston-daily-rotate-file')
const logConf = require('../../config/logger').logger
const path = require('path')

const fs = require('fs')
const logDir = path.join(logConf.logDir)
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const fileTransportOption = {
  dirname: logConf.logDir,
  filename: 'app-',
  datePattern: 'yyyy-MM.log',
  maxDays: logConf.maxDays,
  json: false,
  maxsize: logConf.maxsize,
}

const logger = new (winston.Logger)({
  level: logConf.level,
})

if (logConf.level) {
  logger.add(winston.transports.DailyRotateFile, fileTransportOption)
  logger.add(winston.transports.Console)
}

module.exports = logger

