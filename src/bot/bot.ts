import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Dispatcher } from '@mtcute/dispatcher'
import { TelegramClient } from '@mtcute/node'

import config from '@/config.js'

import messageEvent from './events/message.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const tg = new TelegramClient({
  apiId: config.telegram.apiId,
  apiHash: config.telegram.apiHash,
  storage: join(__dirname, '..', config.telegram.storagePath),
  initConnectionOptions: {
    deviceModel: 'Autoban Bot',
  },
})

export const dp = Dispatcher.for(tg)

dp.onNewMessage(messageEvent)
