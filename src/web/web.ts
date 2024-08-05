import fastify from 'fastify'

import { tg } from '@/bot/bot.js'

export const server = fastify()

server.get('/contacts', async (_, res) => {
  const contacts = await tg.getContacts()

  res.send(contacts)
})
