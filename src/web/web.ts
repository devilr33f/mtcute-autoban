import { createCipheriv } from 'node:crypto'

import fastify from 'fastify'

import { tg } from '@/bot/bot.js'
import config from '@/config.js'

export const server = fastify()

server.get('/contacts', async (_, res) => {
  const contacts = await tg.getContacts()

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(config.crypto.key, 'hex'), Buffer.from(config.crypto.iv, 'hex'))
  const encrypted = Buffer.concat([cipher.update(contacts.map((contact) => contact.id).join(',')), cipher.final()])

  res.send({ contacts: encrypted })
})
