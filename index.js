// 🐺 ALPHA AND OMEGA WOLF XMD - MAIN ENTRY
// Owner: 239166265317 | Company: Simon Tech Inc
// PFP: https://files.catbox.moe/gqz6zv.jpg
// Channel: https://whatsapp.com/channel/0029Vb97vPwChq6GqI44n61S

console.clear()
console.log(`
╔══════════════════════════════════════╗
║  🐺 𓃵 ALPHA AND OMEGA 𓃵 🐺       ║
║          ⚡ WOLF XMD ⚡             ║
║  Version: 1.0.0 PREMIUM - 500 CMD  ║
║  Owner: 239166265317                ║
║  Company: Simon Tech Inc            ║
║  RAM: 2GB PT OPTIMIZED              ║
║  PFP: https://files.catbox.moe/gqz6zv.jpg ║
╚══════════════════════════════════════╝

🚀 Starting WOLF...
`)

const { AlphaOmegaConnection } = require('./connection.js')

// Start
AlphaOmegaConnection().catch(err => {
  console.log("❌ Start Error:", err)
  console.log("🔄 Retrying in 5s...")
  setTimeout(() => AlphaOmegaConnection(), 5000)
})

// Anti crash
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message)
})

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection:', reason)
})
