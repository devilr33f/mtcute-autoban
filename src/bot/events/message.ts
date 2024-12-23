import { createCipheriv } from 'node:crypto'

import type { MessageContext } from '@mtcute/dispatcher'
import { html, type User } from '@mtcute/node'

import { tg } from '@/bot/bot.js'
import config from '@/config.js'

const isBanNeeded = async (context: MessageContext): Promise<string | null> => {
  const sender = context.sender as User
  const chatHistory = await tg.getHistory(sender.inputPeer, { limit: 2 })

  const commonChats = await tg.getCommonChats(sender.inputPeer) // @todo: cache common chats for some time
  if (commonChats.some(chat => config.autoban.whitelistedChats.includes(chat.id))) return null

  if (!sender.isContact && chatHistory.length < 2) return 'non_contact'

  const timeSinceLastMessage = Date.now() - chatHistory[1].date.valueOf()
  if (timeSinceLastMessage >= config.autoban.inactiveTime * 1000) {
    return 'inactive_non_contact'
  }

  return null
}

export default async (context: MessageContext) => {
  if (context.chat.type !== 'user' || context.sender.type !== 'user') return

  if ([
    context.sender.isSelf,
    context.sender.isContact,
    context.sender.isSupport,
  ].some(Boolean)) return

  const verdict = await isBanNeeded(context)
  if (!verdict) return

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(config.crypto.key, 'hex'), Buffer.from(config.crypto.iv, 'hex'))
  const encrypted = Buffer.concat([cipher.update(`${context.sender.id.toString()}|${verdict}`), cipher.final()])

  const message = html`
    🚫 <b>sorry, you can't write to this account</b><br>
    please, <a href="https://femboy.page?utm_source=autoban">contact me</a> to get unbanned
    <br><br>
    <b>note:</b> you need to provide this magic string so i can identify you:
    <pre><code class="base64">${encrypted.toString('base64')}</code></pre>
  `

  await context.replyText(message, {
    disableWebPreview: true,
  })

  await Promise.all([
    tg.blockUser(context.sender.inputPeer),
    tg.sendText('self', html`🚫 banned <code>${context.sender.id}</code> due to <code>${verdict ?? 'unknown'}</code>`),
  ])
}
