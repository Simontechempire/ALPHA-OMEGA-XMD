// 🐺 CONNECTION.JS - ALPHA AND OMEGA WOLF XMD - ONLY FILE THAT LINKS - 710 CMDS
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const express = require('express')

global.wolfDB = global.wolfDB || { auto: { autovv: true, antidelete: true, autoread: false, autotyping: false, autorecording: false, autoreact: false, autoviewstatus: true, reactEmoji: '🐺' }, owners: ["239166265317@s.whatsapp.net","239166265317"], mode: 'public', prefix: '.', deletedCache: {} }
global.sock = null
global.isConnected = false
global.pairingCode = null
global.currentPairingNumber = null
global.lastPairTime = 0
global.appStarted = false
let commands = {}

async function loadPlugins() {
  const pluginsPath = path.join(__dirname, 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, { recursive: true })
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))
  let allCommands = {}
  for (let file of files) {
    try {
      const fp = path.join(pluginsPath, file)
      delete require.cache[require.resolve(fp)]
      const plugin = require(fp)
      if (plugin.command && plugin.execute) {
        for (let cmd of plugin.command) {
          allCommands[cmd.toLowerCase()] = plugin.execute
          allCommands[cmd.toLowerCase().replace(/[^a-z0-9]/g,'')] = plugin.execute
        }
      }
    } catch (e) { console.log(chalk.red(`❌ ${file}: ${e.message}`)) }
  }
  console.log(chalk.magenta(`🐺 TOTAL PLUGINS: ${files.length} | COMMANDS: ${Object.keys(allCommands).length}`))
  return allCommands
}

async function AlphaOmegaConnection() {
  if (!global.appStarted) {
    const app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(__dirname))
    app.get('/', (req,res)=>{ const p = path.join(__dirname, 'index.html'); if(fs.existsSync(p)) return res.sendFile(p); return res.send('🐺 WOLF XMD ONLINE') })
    app.get('/api/status', (req,res)=> res.json({ bot:'WOLF XMD', owner:'239166265317', isConnected: global.isConnected, pairingCode: global.pairingCode, cmds: Object.keys(commands).length, uptime: process.uptime() }))

    async function genCode(phone){
      phone = (phone||'').toString().replace(/[^0-9]/g,'')
      if(!phone) throw new Error('Number required e.g 239166265317')
      if(!global.sock) throw new Error('Bot starting... wait 5s')
      if(global.isConnected) throw new Error('Already linked!')
      const now = Date.now()
      if(global.pairingCode && (now-global.lastPairTime)<50000) return { code: global.pairingCode, phone: global.currentPairingNumber }
      if((now-global.lastPairTime)<10000) throw new Error(`Wait ${Math.ceil((10000-(now-global.lastPairTime))/1000)}s`)
      global.lastPairTime = now
      console.log(chalk.yellow(`🐺 Generating code for ${phone}`))
      const code = await global.sock.requestPairingCode(phone)
      global.pairingCode = code
      global.currentPairingNumber = phone
      console.log(chalk.green.bold(`🔑 CODE: ${code} for ${phone}`))
      return { code, phone }
    }

    app.post('/api/pair', async (req,res)=>{ try{ const r = await genCode(req.body.phone||req.body.number); res.json({ success:true, code: r.code, phone: r.phone }) }catch(e){ res.json({ success:false, message: e.message }) } })
    app.get('/getcode', async (req,res)=>{ try{ const r = await genCode(req.query.number||req.query.phone); res.json({ success:true, code: r.code, phone: r.phone, codeFormatted: r.code.match(/.{1,4}/g).join("-") }) }catch(e){ res.json({ success:false, message: e.message, error: e.message }) } })

    const PORT = process.env.PORT || 10000
    app.listen(PORT, ()=> console.log(chalk.cyan.bold(`\n🌐 WOLF Dashboard on ${PORT}\n`)))
    global.appStarted = true
  }

  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()
  commands = await loadPlugins()
  const sock = makeWASocket({ version, logger: P({ level:'silent' }), printQRInTerminal: false, browser: Browsers.macOS('Safari'), auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level:'silent' })) }, markOnlineOnConnect: true, syncFullHistory: false })
  global.sock = sock
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    try {
      let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ''
      if (!body.startsWith('.')) return
      const args = body.slice(1).trim().split(/ +/)
      const cmdName = (args.shift()||'').toLowerCase().replace(/[^a-z0-9]/g,'')
      const finalCmd = commands[cmdName]
      if (!finalCmd) return
      console.log(chalk.yellow(`[CMD] ${cmdName}`))
      await finalCmd(sock, m, { command: cmdName, text: args.join(' '), args, reply: async (txt)=> await sock.sendMessage(m.key.remoteJid, { text: txt }, { quoted: m }), isOwner: true, prefix: '.' })
    } catch {}
  })
  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'open') { global.isConnected = true; global.pairingCode = null; console.log(chalk.green.bold(`\n✅ WOLF LINKED - ${Object.keys(commands).length} CMDS\n`)); try{ require('./main.js')(sock) }catch{} }
    if (connection === 'close') { global.isConnected = false; const code = lastDisconnect?.error?.output?.statusCode; const rec = code !== DisconnectReason.loggedOut; if(rec) setTimeout(()=>AlphaOmegaConnection(), 3000); else { try{ fs.removeSync('session') }catch{} setTimeout(()=>AlphaOmegaConnection(), 3000) } }
  })
}
module.exports = { startConnection, AlphaOmegaConnection: startConnection };
