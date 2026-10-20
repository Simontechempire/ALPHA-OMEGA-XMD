// 🐺 ALPHA AND OMEGA WOLF XMD - PT.JS FINAL - 700 CMDS + PAIR DASHBOARD
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
  owners: ["239166265317@s.whatsapp.net","239166265317"], 
  mode: 'public', 
  prefix: '.',
  deletedCache: {}
}
global.wolfEco = global.wolfEco || { users: {}, shop: [] }

// ===== PLUGINS LOADER =====
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
    printQRInTerminal: false, // Using pairing dashboard now
    browser: ['ALPHA AND OMEGA WOLF XMD', 'Chrome', '2.5.0'],
    markOnlineOnConnect: true
  })

  sock.ev.on('creds.update', saveCreds)

  // PAIRING CODE REQUEST AT START IF NOT REGISTERED
  if (!sock.authState.creds.registered) {
    console.log(chalk.yellow('\n🐺 NOT PAIRED YET - Use dashboard /pair to get code for 239166265317\n'))
  }

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    if (m.key.fromMe) return

    // AUTO VV
    try {
      const isViewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension
      if (global.wolfDB.auto.autovv && isViewOnce) {
        const viewMsg = (m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension).message
        await sock.sendMessage(m.key.remoteJid, { forward: viewMsg }, { quoted: m }).catch(()=>{})
        await sock.sendMessage(m.key.remoteJid, { text: `👁️ *AUTO VV - VIEW ONCE BYPASSED* 🐺` }, { quoted: m }).catch(()=>{})
      }
    } catch {}

    try {
      if (global.wolfDB.auto.autoread) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadgc && m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadpc && !m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autotyping) await sock.sendPresenceUpdate('composing', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autorecording) await sock.sendPresenceUpdate('recording', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autoreact) {
        await sock.sendMessage(m.key.remoteJid, { react: { text: global.wolfDB.auto.reactEmoji || '🐺', key: m.key } }).catch(()=>{})
      }
      if (global.wolfDB.auto.antidelete) {
        global.wolfDB.deletedCache[m.key.id] = { message: m.message, key: m.key, time: Date.now() }
        for (let id in global.wolfDB.deletedCache) {
          if (Date.now() - global.wolfDB.deletedCache[id].time > 3600000) delete global.wolfDB.deletedCache[id]
        }
      }
    } catch {}

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
      const cmdName = args.shift().toLowerCase().replace(/[^a-z0-9]/g,'') || args[0]
      const rawCmd = args[0] ? body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase() : cmdName
      const finalCmd = commands[rawCmd] ? rawCmd : cmdName
      const text = args.join(' ')

      if (!commands[finalCmd] && !commands[rawCmd]) return
      const useCmd = commands[finalCmd] ? finalCmd : rawCmd

      const isOwner = m.key.fromMe || global.wolfDB.owners.includes(m.key.participant || m.key.remoteJid) || m.key.remoteJid.includes('239166265317') || (m.key.participant && m.key.participant.includes('239166265317'))

      if (global.wolfDB.mode === 'self' && !isOwner) return

      console.log(chalk.yellow(`[CMD] ${useCmd} - ${text.slice(0,30)} - from ${m.key.remoteJid}`))

      await commands[useCmd](sock, m, {
        command: useCmd,
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
    }
  })

  sock.ev.on('messages.update', async updates => {
    for (let upd of updates) {
      try {
        if (upd.update.message === null && global.wolfDB.auto.antidelete) {
          const cached = global.wolfDB.deletedCache?.[upd.key.id]
          if (cached) {
            const participant = upd.key.participant || upd.key.remoteJid
            await sock.sendMessage(upd.key.remoteJid, { 
              text: `🚫 *ANTI-DELETE DETECTED*\n\n@${participant.split('@')[0]} deleted a message! 🐺`,
              mentions: [participant]
            }).catch(()=>{})
            await sock.sendMessage(upd.key.remoteJid, { forward: cached.message }).catch(()=>{})
          }
        }
      } catch {}
    }
  })

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log(chalk.red(`Connection closed, reconnecting: ${shouldReconnect}`))
      if (shouldReconnect) setTimeout(()=>startWolf(), 3000)
      else console.log(chalk.red('Logged out - Delete session folder and re-pair via /pair'))
    } else if (connection === 'open') {
      console.log(chalk.green(`\n🐺 ALPHA AND OMEGA WOLF XMD CONNECTED!`))
      console.log(chalk.cyan(`👑 ${Object.keys(commands).length} COMMANDS ACTIVE!`))
    }
  })
  
  return sock
}

// ===== EXPRESS DASHBOARD + PAIRING =====
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve your index.html dashboard
app.get('/', (req,res)=>{
  const indexPath = path.join(__dirname, 'index.html')
  if (fs.existsSync(indexPath)) res.sendFile(indexPath)
  else res.send('🐺 ALPHA AND OMEGA WOLF XMD - ONLINE - 700+ CMDS - Add index.html')
})

app.get('/health', (req,res)=> res.json({ status:'ONLINE', bot:'ALPHA AND OMEGA', version:'2.5.0', cmds:'710', owner:'239166265317', uptime:process.uptime() }))

// PAIRING API - This is the magic for Render
app.get('/getcode', async (req,res)=>{
  try{
    const number = req.query.number?.replace(/[^0-9]/g,'')
    if(!number) return res.json({ error:'Number required' })
    console.log(chalk.cyan(`🐺 Pair request for ${number}`))

    const { state } = await useMultiFileAuthState('session')
    const { version } = await fetchLatestBaileysVersion()
    const tempSock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) },
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['WOLF PAIR','Chrome','2.5.0']
    })

    if(!tempSock.authState.creds.registered){
      await new Promise(r=>setTimeout(r, 2000))
      let code = await tempSock.requestPairingCode(number)
      code = code?.match(/.{1,4}/g)?.join("-") || code
      console.log(chalk.green(`🔑 Code for ${number}: ${code}`))
      res.json({ code })
    } else {
      res.json({ error:'Already paired - Delete session folder to re-pair' })
    }
  }catch(e){
    console.log(chalk.red('Pair error:'), e.message)
    res.json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(chalk.green(`🌐 Dashboard running on port ${PORT} - / = dash, /getcode?number=239... = pairing`)))

startWolf()
