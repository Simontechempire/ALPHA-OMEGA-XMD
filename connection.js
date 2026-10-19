// 🐺 ALPHA AND OMEGA WOLF XMD - CONNECTION - 700 CMDS CONNECTED
// Owner: 239166265317 | PFP: https://files.catbox.moe/gqz6zv.jpg
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')
const settings = require('./settings')

// Global DB for all plugins
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
  owners: ["239166265317@s.whatsapp.net"], 
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

  // PAIRING CODE FOR 239166265317
  if (!sock.authState.creds.registered) {
    const phoneNumber = settings.ownerNumber.replace(/[^0-9]/g, '')
    console.log(`\n🐺 WOLF XMD - Requesting Pairing Code...\n`)
    console.log(`📱 Owner Number: ${phoneNumber}\n`)
    
    await new Promise(r => setTimeout(r, 3000))
    
    try {
      let code = await sock.requestPairingCode(phoneNumber)
      code = code?.match(/.{1,4}/g)?.join("-") || code
      console.log(`
╔════════════════════════════════════╗
║  🔑 YOUR PAIRING CODE: ${code}  ║
╚════════════════════════════════════╝

👉 STEPS:
1. Open WhatsApp on phone 239166265317
2. Go to Settings > Linked Devices
3. Click "Link a Device"
4. Click "Link with phone number instead"
5. Enter Code: ${code}

🐺 WOLF WAITING FOR CONNECTION...
      `)
    } catch (e) {
      console.log("❌ Pairing Error:", e.message)
    }
  }

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('🔴 Connection closed, reason:', lastDisconnect?.error)
      if (shouldReconnect) {
        console.log('🔄 Reconnecting WOLF in 3s...')
        setTimeout(() => AlphaOmegaConnection(), 3000)
      } else {
        console.log('❌ Logged out, delete session folder')
      }
    } else if (connection === 'open') {
      console.log(`
✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
🐺 ALPHA AND OMEGA CONNECTED!
⚡ WOLF XMD - 700 CMD TITAN READY
📱 Owner: ${settings.ownerNumber}
🟢 Status: ACTIVE ON 2GB PT
✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅

🔗 Auto-joining Channel...
Link: ${settings.channelLink}
      `)
      
      try {
        await sock.newsletterFollow("120363405065075853@newsletter").catch(()=>{})
        console.log("✅ Channel Follow Attempted!")
      } catch (e) {
        console.log("Channel join error (ignore):", e.message)
      }

      // Load main handler with ALL plugins
      require('./main.js')(sock)
      
      try {
        await sock.sendMessage(settings.ownerNumber + "@s.whatsapp.net", {
          image: { url: settings.pfpUrl },
          caption: `🐺 *ALPHA AND OMEGA CONNECTED!*\n\n⚡ WOLF XMD 700 CMD TITAN\n✅ Active on 2GB PT Panel\n🟢 Status: ONLINE\n📦 15 Plugins Loaded\n🎯 700+ Cmds Active\n\nOwner: ${settings.ownerNumber}\nCompany: Simon Tech Inc\n\n*WOLF NEVER SLEEPS*`
        })
      } catch {}
    }
  })

  return sock
}

module.exports = { AlphaOmegaConnection }
