// 🐺 ALPHA AND OMEGA WOLF XMD - CONNECTION FINAL - RENDER SAFE - 700 CMDS
// Owner: 239166265317 | No auto-pair - uses dashboard /getcode
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const settings = require('./settings')

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
global.wolfEco = global.wolfEco || { users: {} }

async function AlphaOmegaConnection() {
  const { state, saveCreds } = await useMultiFileAuthState('./session')
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
    },
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ["ALPHA AND OMEGA WOLF", "Chrome", "2.5.0"],
    markOnlineOnConnect: true,
    syncFullHistory: false
  })

  // RENDER FIX: Don't auto-request pairing code here!
  // Pairing is now done via dashboard /getcode API
  if (!sock.authState.creds.registered) {
    console.log(`
╔══════════════════════════════════════╗
║  🐺 WOLF NOT PAIRED YET            ║
║  Go to: / on your dashboard        ║
║  Click PAIR tab                     ║
║  Enter: ${settings.ownerNumber}     ║
║  Get CODE and enter in WhatsApp    ║
╚══════════════════════════════════════╝
    `)
  }

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut
      console.log('🔴 Connection closed:', lastDisconnect?.error?.message || statusCode)
      if (shouldReconnect) {
        console.log('🔄 Reconnecting WOLF in 5s...')
        setTimeout(() => AlphaOmegaConnection(), 5000)
      } else {
        console.log('❌ Logged out - Delete session folder and re-pair via dashboard /')
      }
    } else if (connection === 'open') {
      console.log(`
✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
🐺 ALPHA AND OMEGA CONNECTED!
⚡ WOLF XMD - 700 CMD TITAN READY
📱 Owner: ${settings.ownerNumber}
🟢 Status: ACTIVE - RENDER READY
✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
      `)
      
      try {
        await sock.newsletterFollow("120363405065075853@newsletter").catch(()=>{})
      } catch {}

      // Load main handler with ALL 15 plugins
      require('./main.js')(sock)
      
      try {
        await sock.sendMessage(settings.ownerNumber + "@s.whatsapp.net", {
          image: { url: settings.pfpUrl },
          caption: `🐺 *ALPHA AND OMEGA CONNECTED!*\n\n⚡ WOLF XMD 710 CMD TITAN\n✅ Active on Render - No PT Panel\n🟢 Status: ONLINE\n📦 15 Plugins Loaded\n🎯 710+ Cmds Active\n\nDashboard: ${process.env.RENDER_EXTERNAL_URL || 'Your Render Link'}\nOwner: ${settings.ownerNumber}\n\n*WOLF NEVER SLEEPS*`
        })
      } catch {}
    }
  })

  return sock
}

module.exports = { AlphaOmegaConnection }
