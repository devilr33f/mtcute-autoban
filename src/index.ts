import { oneLine } from 'common-tags'
import { createLogger, format, transports } from 'winston'

import config from '@/config.js'

import { tg } from './bot/bot.js'

const logger = createLogger({
  level: 'info',
  defaultMeta: { type: 'index' },
  format: format.combine(
    format.colorize({ all: true }),
    format.timestamp(),
    format.printf(({ level, message, timestamp, type }) => {
      return `${timestamp} [${level}] ${type}: ${message}`
    }),
  ),
  transports: [
    new transports.Console(),
  ],
})

const init = async () => {
  logger.info(oneLine`
    starting
    ${config.package.name}
    (${config.package.version})
    in ${config.package.mode} mode...
  `)

  await tg.run({
    phone: () => tg.input('phone > '),
    code: () => tg.input('code > '),
    password: () => tg.input('2fa > '),
  }, (me) => {
    logger.info(`logged in as ${me.firstName}`)
  })
}

init()
