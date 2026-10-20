// 🐺 CONNECTION.JS - HELPER MODULE - NO EXPRESS HERE
// pt.js already has the dashboard, this is just for compatibility
// If index.js is used as start, this will be called

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')

async function loadPlugins() {
  const pluginsPath = path.join(__dirname, 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, { recursive: true })
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))
  let allCommands = {}
  for (let file of files) {
    try {
      const filePath = path.join(pluginsPath, file)
      delete require.cache[require.resolve(filePath)]
      const plugin = require(filePath)
      if (plugin.command && plugin.execute) {
        for (let cmd of plugin.command) {
          allCommands[cmd.toLowerCase()] = plugin.execute
          allCommands[cmd.toLowerCase().replace(/[^a-z0-9]/g,'')] = plugin.execute
        }
      }
    } catch {}
  }
  return allCommands
}

async function AlphaOmegaConnection() {
  console.log(chalk.yellow('🐺 AlphaOmegaConnection called from index.js - starting wolf...'))
  const { state, saveCreds } = await useMultiFileAuthState('session')
  const { version } = await fetchLatestBaileysVersion()
  const commands = await loadPlugins()

  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) },
    printQRInTerminal: false,
    browser: ['ALPHA AND OMEGA WOLF XMD', 'Chrome', '2.5.0'],
    markOnlineOnConnect: true
  })
  
  global.sock = sock
  sock.ev.on('creds.update', saveCreds)
  
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    try {
      let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || ''
      const prefix = '.'
      if (!body.startsWith(prefix)) return
      const args = body.slice(prefix.length).trim().split(/ +/)
      const cmdName = args.shift().toLowerCase().replace(/[^a-z0-9]/g,'')
      if (!commands[cmdName]) return
      await commands[cmdName](sock, m, { command: cmdName, text: args.join(' '), args, reply: async (txt)=> await sock.sendMessage(m.key.remoteJid, { text: txt }, { quoted: m }), isOwner: true, prefix })
    } catch (e) {}
  })

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      if (shouldReconnect) setTimeout(()=>AlphaOmegaConnection(), 3000)
    } else if (connection === 'open') {
      console.log(chalk.green(`\n✅ WOLF CONNECTED - ${Object.keys(commands).length} CMDS\n`))
    }
  })
  
  return sock
}

module.exports = { AlphaOmegaConnection }
