// 🐺 ALPHA AND OMEGA WOLF XMD - PT.JS FINAL - FIXED PAIR + 700 CMDS
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const express = require('express')

global.wolfDB = global.wolfDB || { 
  auto: { autovv: true, antidelete: true, autoread: false, autoreadgc: false, autoreadpc: false, autotyping: false, autorecording: false, autoreact: false, autoviewstatus: true, autolikestatus: false, reactEmoji: '🐺', autobio: false, autobioText: '🐺 WOLF XMD | {time}' }, 
  nsfw: {}, owners: ["239166265317@s.whatsapp.net","239166265317"], mode: 'public', prefix: '.', deletedCache: {}
}
global.wolfEco = global.wolfEco || { users: {}, shop: [] }
global.sock = null
global.isConnected = false
global.pairingCode = null
global.currentPairingNumber = null
global.lastPairTime = 0

async function loadPlugins() {
  const pluginsPath = path.join(__dirname, 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, { recursive: true })
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))
  let allCommands = {}
  let totalFiles = 0
  console.log(chalk.cyan(`\n🐺 Loading plugins...\n`))
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
        totalFiles++
      }
    } catch (e) { console.log(chalk.red(`❌ ${file}: ${e.message}`)) }
  }
  console.log(chalk.magenta(`🐺 TOTAL: ${totalFiles} files | ${Object.keys(allCommands).length} cmds\n`))
  return allCommands
}

let commands = {}
let sockInstance = null

async function startWolf() {
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()
  commands = await loadPlugins()

  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) },
    printQRInTerminal: false,
    browser: ['ALPHA AND OMEGA WOLF XMD', 'Chrome', '2.5.0'],
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    syncFullHistory: false
  })

  sockInstance = sock
  global.sock = sock
  sock.ev.on('creds.update', saveCreds)

  if (!sock.authState.creds.registered) {
    console.log(chalk.yellow('\n🐺 NOT PAIRED - Use dashboard to pair 239166265317\n'))
  }

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    try {
      if (global.wolfDB.auto.autoread) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadgc && m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadpc && !m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autotyping) await sock.sendPresenceUpdate('composing', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autorecording) await sock.sendPresenceUpdate('recording', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autoreact) await sock.sendMessage(m.key.remoteJid, { react: { text: global.wolfDB.auto.reactEmoji || '🐺', key: m.key } }).catch(()=>{})
      if (global.wolfDB.auto.antidelete) {
        global.wolfDB.deletedCache[m.key.id] = { message: m.message, key: m.key, time: Date.now() }
      }
      // AUTO VV
      const isViewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2
      if (global.wolfDB.auto.autovv && isViewOnce) {
        const viewMsg = (m.message.viewOnceMessage || m.message.viewOnceMessageV2).message
        await sock.sendMessage(m.key.remoteJid, { forward: viewMsg }, { quoted: m }).catch(()=>{})
      }
    } catch {}

    try {
      let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''
      const prefix = global.wolfDB.prefix || '.'
      if (!body.startsWith(prefix)) return
      const args = body.slice(prefix.length).trim().split(/ +/)
      const rawCmd = args.shift().toLowerCase()
      const cmdName = rawCmd.replace(/[^a-z0-9]/g,'') || rawCmd
      const finalCmd = commands[rawCmd] ? rawCmd : commands[cmdName] ? cmdName : null
      if (!finalCmd) return
      const text = args.join(' ')
      const isOwner = m.key.fromMe || global.wolfDB.owners.includes(m.key.participant || m.key.remoteJid) || (m.key.remoteJid && m.key.remoteJid.includes('239166265317'))
      if (global.wolfDB.mode === 'self' && !isOwner) return
      console.log(chalk.yellow(`[CMD] ${finalCmd} from ${m.key.remoteJid}`))
      await commands[finalCmd](sock, m, { command: finalCmd, text, args, reply: async (txt, opts={})=> await sock.sendMessage(m.key.remoteJid, { text: txt, ...opts }, { quoted: m }), isOwner, prefix })
    } catch (e) { console.log(chalk.red(`[CMD ERROR] ${e.message}`)) }
  })

  sock.ev.on('messages.update', async updates => {
    for (let upd of updates) {
      try {
        if (upd.update.message === null && global.wolfDB.auto.antidelete) {
          const cached = global.wolfDB.deletedCache?.[upd.key.id]
          if (cached) {
            const participant = upd.key.participant || upd.key.remoteJid
            await sock.sendMessage(upd.key.remoteJid, { text: `🚫 *ANTI-DELETE* @${participant.split('@')[0]} deleted! 🐺`, mentions: [participant] }).catch(()=>{})
            await sock.sendMessage(upd.key.remoteJid, { forward: cached.message }).catch(()=>{})
          }
        }
      } catch {}
    }
  })

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      global.isConnected = false
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log(chalk.red(`Closed, reconnect: ${shouldReconnect}`))
      if (shouldReconnect) setTimeout(()=>startWolf(), 3000)
      else console.log(chalk.red('Logged out - Delete session folder'))
    } else if (connection === 'open') {
      global.isConnected = true
      global.pairingCode = null
      console.log(chalk.green(`\n🐺 WOLF CONNECTED! ${Object.keys(commands).length} CMDS ACTIVE!\n`))
    }
  })
}

// ===== EXPRESS DASHBOARD - FIXED - SINGLE SOCK =====
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname))

app.get('/', (req,res)=>{
  const indexPath = path.join(__dirname, 'index.html')
  if (fs.existsSync(indexPath)) res.sendFile(indexPath)
  else res.send('🐺 WOLF XMD ONLINE - Add index.html')
})

app.get('/api/status', (req,res)=> res.json({ status: global.isConnected ? 'ONLINE' : 'OFFLINE', bot:'WOLF XMD', cmds: Object.keys(commands).length, owner:'239166265317', pairingCode: global.pairingCode, isConnected: global.isConnected, uptime:process.uptime() }))

// FIXED PAIR - USES MAIN SOCK, NOT TEMP SOCK
async function handlePair(phone){
  phone = phone.replace(/[^0-9]/g,'')
  if(!phone) throw new Error('Number required')
  if(!sockInstance) throw new Error('Bot still starting... wait 5s')
  if(global.isConnected) throw new Error('Already paired!')
  const now = Date.now()
  if(global.pairingCode && (now - global.lastPairTime) < 50000){
    return { code: global.pairingCode, phone: global.currentPairingNumber }
  }
  if((now - global.lastPairTime) < 10000) throw new Error(`Wait ${Math.ceil((10000-(now-global.lastPairTime))/1000)}s`)
  global.lastPairTime = now
  console.log(chalk.yellow(`🐺 Generating code for ${phone}`))
  const code = await sockInstance.requestPairingCode(phone)
  global.pairingCode = code
  global.currentPairingNumber = phone
  console.log(chalk.green.bold(`🔑 CODE: ${code} for ${phone}`))
  return { code, phone }
}

app.post('/api/pair', async (req,res)=>{
  try{
    const phone = req.body.phone || req.body.number || ''
    const result = await handlePair(phone)
    res.json({ success:true, code: result.code, phone: result.phone })
  }catch(e){
    console.log(chalk.red('Pair error:'), e.message)
    let msg = e.message
    if(msg.includes('rate')) msg = 'Too many tries - Wait 5 mins'
    res.json({ success:false, message: msg })
  }
})

app.get('/getcode', async (req,res)=>{
  try{
    const phone = req.query.number || req.query.phone || ''
    const result = await handlePair(phone)
    res.json({ success:true, code: result.code, phone: result.phone, codeFormatted: result.code?.match(/.{1,4}/g)?.join("-") })
  }catch(e){
    res.json({ success:false, message: e.message, error: e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(chalk.green(`🌐 Dashboard on ${PORT}`)))
startWolf()
