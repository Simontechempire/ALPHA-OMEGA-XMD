// 🐺 INDEX.JS - FIXED - NO DOUBLE SERVER - JUST STARTER
console.clear()
console.log(`
╔══════════════════════════════════════╗
║  🐺 ALPHA AND OMEGA WOLF XMD 🐺    ║
║  Version: 2.5.0 - 710 CMD TITAN    ║
║  Owner: 239166265317               ║
║  Entry: index.js -> pt.js          ║
╚══════════════════════════════════════╝
`)

// SINGLE ENTRY - pt.js already has Express + Pair + 710 cmds
// This file just starts pt.js to avoid double server crash

try {
  require('./pt.js')
} catch (e) {
  console.log("❌ pt.js error:", e.message)
  console.log("Trying connection.js fallback...")
  const { AlphaOmegaConnection } = require('./connection.js')
  AlphaOmegaConnection().catch(err => {
    console.log("❌ Error:", err.message)
    setTimeout(() => AlphaOmegaConnection(), 5000)
  })
}

process.on('uncaughtException', e=> console.log('Exception:', e.message))
process.on('unhandledRejection', e=> console.log('Rejection:', e))
