// 🐺 PT PANEL - ALPHA AND OMEGA WOLF XMD - 2GB OPTIMIZED
const express = require('express')
const app = express()
const path = require('path')

const PORT = process.env.PORT || 3000

// Serve HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// Health check for PT
app.get('/health', (req, res) => {
  res.json({ 
    status: "ACTIVE", 
    bot: "ALPHA AND OMEGA WOLF XMD",
    version: "1.0.0 PREMIUM",
    commands: 500,
    owner: "239166265317",
    company: "Simon Tech Inc",
    ram: "2GB Optimized"
  })
})

app.listen(PORT, () => {
  console.log(`
🐺 𓃵 ALPHA AND OMEGA 𓃵 🐺
⚡ WOLF XMD ⚡
━━━━━━━━━━━━━━━━━━━━
PT PANEL RUNNING
PORT: ${PORT}
BOT: 500 CMD TITAN
RAM: 2GB OPTIMIZED
OWNER: 239166265317
━━━━━━━━━━━━━━━━━━━━
  `)
  // Start bot after server
  require('./index.js')
})
