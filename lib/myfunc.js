// 🐺 ALPHA AND OMEGA WOLF XMD - MAIN HANDLER - TYPE 2 - 710 CMD - 2GB OPTIMIZED
// This file is now DEPRECATED - main.js is the new handler
// Kept for backward compatibility - Redirects to main.js TYPE 2
const settings = require('./settings')
const chalk = require('chalk')

console.log(chalk.yellow("⚠️  [WOLF] handler-onefile.js is deprecated, using main.js TYPE 2 instead..."))

module.exports = async (sock) => {
  console.log(chalk.cyan(`🐺 WOLF ONE-FILE HANDLER - TYPE 2 WRAPPER - Redirecting to main.js`))
  
  // Load new TYPE 2 main handler
  try {
    const mainHandler = require('./main.js');
    await mainHandler(sock);
    console.log(chalk.green("✅ Redirected to main.js TYPE 2 - 710 CMDS + Dashboard ENV"));
  } catch (e) {
    console.log(chalk.red("Failed to load main.js: " + e.message));
    // Fallback minimal handler TYPE 2
    const { WOLF_MENU } = require('./lib/menu.js');
    
    sock.ev.on('messages.upsert', async ({ messages }) => {
      const m = messages[0]
      if (!m.message) return
      if (m.key.remoteJid === 'status@broadcast') return

      const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || ""
      if (!body.startsWith(settings.prefix)) return

      const args = body.slice(settings.prefix.length).trim().split(/ +/)
      const command = args.shift().toLowerCase().replace(/[^a-z0-9]/g,'')
      const q = args.join(" ")
      const reply = async (text) => await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m })

      const isOwner = settings.owner.includes(m.key.remoteJid) || settings.extraOwners.some(n => m.key.remoteJid.includes(n))

      try {
        if (['menu','help','allcmd'].includes(command)) {
          await sock.sendMessage(m.key.remoteJid, { image: { url: settings.aliveImg }, caption: WOLF_MENU }, { quoted: m })
          return
        }
        if (['ping','speed'].includes(command)) {
          const start = Date.now()
          await reply(`🐺 PINGING...`)
          await reply(`⚡ ${Date.now() - start}ms | TYPE 2 | MODE: ${settings.mode}`)
          return
        }
        if (command === 'alive') {
          await sock.sendMessage(m.key.remoteJid, { image: { url: settings.aliveImg }, caption: settings.aliveMsg + `\n\nMODE: ${settings.mode} TYPE 2` }, { quoted: m })
          return
        }
        if (command === 'owner') {
          await reply(`👑 ${settings.ownerName}\n${settings.ownerNumber}\n${settings.channelLink}`)
          return
        }
        // Fallback for all other cmds
        if (command.length > 1) {
          await reply(`🐺 *${command.toUpperCase()}* - TYPE 2 Active\nUse .menu for full 710 cmds\nDashboard ENV: ${settings.mode}`)
        }
      } catch (e) {
        console.log(`WOLF Error ${command}:`, e.message)
      }
    })
  }
}
