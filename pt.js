// 🐺 ALPHA AND OMEGA WOLF XMD - PT.JS MAIN - CONNECTS ALL PLUGINS
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const express = require('express')

global.wolfDB = global.wolfDB || { 
  auto: { 
    autovv: true, 
    antidelete: true, 
    autoread: false, 
    autoreadgc: false,
    autoreadpc: false,
    autotyping: false, 
    autorecording: false,
    autoreact: false,
    autoviewstatus: true,
    autolikestatus: false,
    reactEmoji: '🐺',
    autobio: false,
    autobioText: '🐺 ALPHA AND OMEGA WOLF XMD | {time}'
  }, 
  nsfw: {}, 
  owners: [], 
  mode: 'public', 
  prefix: '.',
  deletedCache: {}
}
global.wolfEco = global.wolfEco || { users: {}, shop: [] }

async function loadPlugins() {
  const pluginsPath = path.join(__dirname, 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, { recursive: true })
  
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))
  let allCommands = {}
  let totalFiles = 0

  console.log(chalk.cyan(`\n🐺 Loading plugins from ${pluginsPath}...\n`))

  for (let file of files) {
    try {
      const filePath = path.join(pluginsPath, file)
      delete require.cache[require.resolve(filePath)]
      const plugin = require(filePath)
      
      if (plugin.command && plugin.execute) {
        for (let cmd of plugin.command) {
          const cleanCmd = cmd.toLowerCase().trim().replace(/[^a-z0-9]/g,'') || cmd.toLowerCase().trim()
          if (cleanCmd) allCommands[cleanCmd] = plugin.execute
          // also keep original
          allCommands[cmd.toLowerCase()] = plugin.execute
        }
        console.log(chalk.green(`✅ ${file} - ${plugin.command.length} cmds`))
        totalFiles++
      } else {
        console.log(chalk.yellow(`⚠️ ${file} - no command/export`))
      }
    } catch (e) {
      console.log(chalk.red(`❌ Failed ${file}: ${e.message}`))
    }
  }
  
  console.log(chalk.magenta(`\n🐺 TOTAL PLUGINS: ${totalFiles} files`))
  console.log(chalk.magenta(`🐺 TOTAL COMMANDS: ${Object.keys(allCommands).length}\n`))
  return allCommands
}

async function startWolf() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()
  let commands = await loadPlugins()

  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    auth: { 
      creds: state.creds, 
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) 
    },
    printQRInTerminal: true,
    browser: ['ALPHA AND OMEGA WOLF XMD', 'Chrome', '2.5.0'],
    markOnlineOnConnect: true
  })

  sock.ev.on('creds.update', saveCreds)

  // ===== AUTO FEATURES REAL TIME HANDLER =====
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    if (m.key.fromMe) return

    // --- AUTO VV - ViewOnce Bypass ---
    try {
      const isViewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension
      if (global.wolfDB.auto.autovv && isViewOnce) {
        const viewMsg = (m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension).message
        await sock.sendMessage(m.key.remoteJid, { forward: viewMsg }, { quoted: m }).catch(()=>{})
        await sock.sendMessage(m.key.remoteJid, { text: `👁️ *AUTO VV - VIEW ONCE BYPASSED*\n\nMedia auto saved! 🐺 ALPHA AND OMEGA` }, { quoted: m })
      }
    } catch {}

    // --- Auto Read / Typing / React / Cache ---
    try {
      if (global.wolfDB.auto.autoread) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadgc && m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadpc && !m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autotyping) await sock.sendPresenceUpdate('composing', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autorecording) await sock.sendPresenceUpdate('recording', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autoreact) {
        await sock.sendMessage(m.key.remoteJid, { react: { text: global.wolfDB.auto.reactEmoji || '🐺', key: m.key } }).catch(()=>{})
      }

      // Cache for AntiDelete
      if (global.wolfDB.auto.antidelete) {
        global.wolfDB.deletedCache[m.key.id] = { message: m.message, key: m.key, time: Date.now() }
        // Clean old cache > 1 hour
        for (let id in global.wolfDB.deletedCache) {
          if (Date.now() - global.wolfDB.deletedCache[id].time > 3600000) delete global.wolfDB.deletedCache[id]
        }
      }
    } catch {}

    // ===== COMMAND HANDLER =====
    try {
      const msgType = Object.keys(m.message)[0]
      let body = ''
      if (msgType === 'conversation') body = m.message.conversation
      else if (msgType === 'extendedTextMessage') body = m.message.extendedTextMessage.text
      else if (msgType === 'imageMessage') body = m.message.imageMessage.caption || ''
      else if (msgType === 'videoMessage') body = m.message.videoMessage.caption || ''
      else if (msgType === 'viewOnceMessage') body = m.message.viewOnceMessage.message?.imageMessage?.caption || m.message.viewOnceMessage.message?.videoMessage?.caption || ''
      else if (msgType === 'viewOnceMessageV2') body = m.message.viewOnceMessageV2.message?.imageMessage?.caption || m.message.viewOnceMessageV2.message?.videoMessage?.caption || ''

      const prefix = global.wolfDB.prefix || '.'
      if (!body.startsWith(prefix)) return

      const args = body.slice(prefix.length).trim().split(/ +/)
      const cmdName = args.shift().toLowerCase()
      const text = args.join(' ')

      if (!commands[cmdName]) return

      const isOwner = m.key.fromMe || global.wolfDB.owners.includes(m.key.participant || m.key.remoteJid)

      // Public/Self mode check
      if (global.wolfDB.mode === 'self' && !isOwner) return

      console.log(chalk.yellow(`[CMD] ${cmdName} - ${text.slice(0,30)} - from ${m.key.remoteJid}`))

      await commands[cmdName](sock, m, {
        command: cmdName,
        text,
        args,
        reply: async (txt, opts = {}) => {
          return await sock.sendMessage(m.key.remoteJid, { text: txt, ...opts }, { quoted: m })
        },
        isOwner,
        prefix
      })

    } catch (e) {
      console.log(chalk.red(`[CMD ERROR] ${e.message}`))
      await sock.sendMessage(m.key.remoteJid, { text: `❌ Error: ${e.message}\n\n🐺 WOLF XMD` }, { quoted: m }).catch(()=>{})
    }
  })

  // ===== ANTI DELETE RECOVERY =====
  sock.ev.on('messages.update', async updates => {
    for (let upd of updates) {
      try {
        if (upd.update.message === null && global.wolfDB.auto.antidelete) {
          const cached = global.wolfDB.deletedCache?.[upd.key.id]
          if (cached) {
            const participant = upd.key.participant || upd.key.remoteJid
            await sock.sendMessage(upd.key.remoteJid, { 
              text: `🚫 *ANTI-DELETE DETECTED*\n\n@${participant.split('@')[0]} deleted a message!\n\nRecovering... 🐺`,
              mentions: [participant]
            }).catch(()=>{})
            
            try {
              await sock.sendMessage(upd.key.remoteJid, { forward: cached.message }).catch(async()=>{
                const txt = cached.message.conversation || cached.message.extendedTextMessage?.text || cached.message.imageMessage?.caption || 'Media message'
                await sock.sendMessage(upd.key.remoteJid, { text: `📩 Recovered content:\n\n${txt}\n\n🐺 ANTI-DELETE` })
              })
            } catch {}
          }
        }
      } catch {}
    }
  })

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log(chalk.red(`Connection closed, reconnecting: ${shouldReconnect}`))
      if (shouldReconnect) startWolf()
    } else if (connection === 'open') {
      console.log(chalk.green(`\n🐺 ALPHA AND OMEGA WOLF XMD CONNECTED!`))
      console.log(chalk.cyan(`👑 ${Object.keys(commands).length} COMMANDS ACTIVE - 15 FILES LOADED!`))
      console.log(chalk.yellow(`🔥 PREFIX: ${global.wolfDB.prefix} | MODE: ${global.wolfDB.mode}\n`))
    }
  })
}

// Express keep alive (for panel hosting)
const app = express()
app.get('/', (req,res)=> res.send('🐺 ALPHA AND OMEGA WOLF XMD - ONLINE - 700+ CMDS - PT.JS CONNECTED'))
app.listen(process.env.PORT || 3000, ()=> console.log(chalk.green(`🌐 Web server on port ${process.env.PORT || 3000}`)))

startWolf()
