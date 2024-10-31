import fastify from 'fastify'

import { tg } from '@/bot/bot.js'
import config from '@/config.js'

export const server = fastify()

server.get('/contacts', async (req, res) => {
  if (!req.headers.authorization || !config.web.tokens.includes(req.headers.authorization.split(' ')[1])) return res.status(401).send()

  const contacts = await tg.getContacts()
  res.send({ contacts: contacts.map((contact) => contact.id) })
})
