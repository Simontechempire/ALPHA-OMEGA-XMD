// 🐺 ALPHA AND OMEGA WOLF XMD - INDEX.JS FINAL - DASHBOARD + PAIR
const express = require('express')
const path = require('path')
const fs = require('fs-extra')

console.clear()
console.log(`
╔══════════════════════════════════════╗
║  🐺 𓃵 ALPHA AND OMEGA 𓃵 🐺       ║
║  Version: 2.5.0 - 710 CMD TITAN    ║
║  Owner: 239166265317                ║
║  Dashboard + Pair: ENABLED          ║
╚══════════════════════════════════════╝
`)

const app = express()
app.use(express.json())

app.get('/', (req,res)=>{
  const p = path.join(__dirname, 'index.html')
  if(fs.existsSync(p)) res.sendFile(p)
  else res.send('🐺 WOLF ONLINE - 710 CMDS - Add index.html')
})

app.get('/health', (req,res)=> res.json({ status:'ONLINE', bot:'WOLF XMD', cmds:710, owner:'239166265317', uptime:process.uptime() }))

app.get('/getcode', async (req,res)=>{
  try{
    const number = req.query.number?.replace(/[^0-9]/g,'')
    if(!number) return res.json({ error:'Number required' })
    console.log(`🐺 Pair: ${number}`)

    const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
    const P = require('pino')
    const { state } = await useMultiFileAuthState('session')
    const { version } = await fetchLatestBaileysVersion()
    const sock = makeWASocket({
      version,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) },
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ['WOLF PAIR','Chrome','2.5.0']
    })

    if(!sock.authState.creds.registered){
      await new Promise(r=>setTimeout(r,1500))
      let code = await sock.requestPairingCode(number)
      code = code?.match(/.{1,4}/g)?.join("-") || code
      console.log(`🔑 CODE ${code} for ${number}`)
      res.json({ code })
    } else {
      res.json({ error:'Already paired - delete session folder' })
    }
  }catch(e){
    res.json({ error:e.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> console.log(`🌐 Dashboard: ${PORT} - Open / for PAIR tab`))

// START WOLF
const { AlphaOmegaConnection } = require('./connection.js')
AlphaOmegaConnection().catch(err => {
  console.log("❌ Error:", err.message)
  setTimeout(() => AlphaOmegaConnection(), 5000)
})

process.on('uncaughtException', e=> console.log('Exception:', e.message))
process.on('unhandledRejection', e=> console.log('Rejection:', e))
