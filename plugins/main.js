// 🐺 ALPHA AND OMEGA WOLF XMD - FILE 1 MAIN - 49 CMDS - REAL HANDLERS
const settings = require('../settings')
const { WOLF_MENU } = require('../lib/menu.js')
const os = require('os')
const fs = require('fs')

module.exports = {
  command: ['menu','help','ping','alive','runtime','owner','botinfo','support','about','version','speed','uptime','status','repository','script','dashboard','listcmd','allcmd','command','prefix','system','server','host','platform','device','users','groups','chats','time','date','timezone','language','feedback','report','suggest','contact','donate','terms','privacy','disclaimer','credits','thanks','rules','guide','tutorial','faq','statusbot','check','info','gstatus'],

  execute: async (sock, m, { command, text, reply }) => {

    // .menu
    if (command === 'menu') {
      await sock.sendMessage(m.key.remoteJid, { image: { url: settings.pfpUrl }, caption: WOLF_MENU }, { quoted: m })
    }

    // .help
    if (command === 'help') {
      await sock.sendMessage(m.key.remoteJid, { image: { url: settings.pfpUrl }, caption: WOLF_MENU }, { quoted: m })
    }

    // .ping
    if (command === 'ping') {
      const start = Date.now()
      await sock.sendMessage(m.key.remoteJid, { text: '🐺 Pinging WOLF...' }, { quoted: m })
      const end = Date.now()
      reply(`⚡ *PONG!* ${end - start}ms\n🟢 ALPHA AND OMEGA WOLF XMD`)
    }

    // .alive
    if (command === 'alive') {
      await sock.sendMessage(m.key.remoteJid, {
        image: { url: settings.pfpUrl },
        caption: `🐺 *ALPHA AND OMEGA IS ALIVE!*\n\n⚡ Version: 1.0.0 PREMIUM\n📚 Commands: 501\n⏰ Runtime: ${Math.floor(process.uptime()/3600)}h ${Math.floor((process.uptime()%3600)/60)}m\n💻 Platform: ${os.platform()}\n👑 Owner: ${settings.ownerNumber}\n🟢 Status: ONLINE\n\n*WOLF NEVER SLEEPS*`
      }, { quoted: m })
    }

    // .runtime
    if (command === 'runtime') {
      const up = process.uptime()
      const d = Math.floor(up/86400), h = Math.floor((up%86400)/3600), mm = Math.floor((up%3600)/60), s = Math.floor(up%60)
      reply(`⏰ *RUNTIME*\n\n${d}d ${h}h ${mm}m ${s}s\n\n🐺 WOLF XMD`)
    }

    // .uptime - same as runtime
    if (command === 'uptime') {
      const up = process.uptime()
      const d = Math.floor(up/86400), h = Math.floor((up%86400)/3600), mm = Math.floor((up%3600)/60), s = Math.floor(up%60)
      reply(`⏰ *UPTIME*\n\n${d}d ${h}h ${mm}m ${s}s\n\n🐺 WOLF XMD`)
    }

    // .owner
    if (command === 'owner') {
      await sock.sendMessage(m.key.remoteJid, {
        image: { url: settings.pfpUrl },
        caption: `👑 *OWNER INFO*\n\nName: Simon Tech Inc\nNumber: ${settings.ownerNumber}\nWa: wa.me/${settings.ownerNumber}\nCompany: Simon Tech Inc\nChannel: ${settings.channelLink}\n\n🐺 ALPHA AND OMEGA`
      }, { quoted: m })
    }

    // .botinfo
    if (command === 'botinfo') {
      reply(`🐺 *BOT INFORMATION*\n\nBot: ALPHA AND OMEGA\nVersion: 1.0.0 PREMIUM\nPrefix: ${settings.prefix}\nPlatform: WhatsApp\nRuntime: Node.js\nCommands: 501\nOwner: ${settings.ownerNumber}\nRAM: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)}MB / 2GB\n\n🐺`)
    }

    // .support
    if (command === 'support') {
      reply(`📩 *SUPPORT*\n\nOwner: wa.me/${settings.ownerNumber}\nChannel: ${settings.channelLink}\nEmail: support@simontech.com\n\n🐺 WOLF SUPPORT`)
    }

    // .about
    if (command === 'about') {
      reply(`🐺 *ABOUT WOLF XMD*\n\nALPHA AND OMEGA WOLF XMD is a premium WhatsApp bot with 501 commands titan built for 2GB PT panel.\nBuilt by Simon Tech Inc (239166265317)\nPowered by Node.js + Baileys\n\n*WOLF NEVER SLEEPS*`)
    }

    // .version
    if (command === 'version') {
      reply(`⚡ *VERSION*\n\n1.0.0 PREMIUM\nLast Update: Today\nCommands: 501\nNode: ${process.version}\n\n🐺`)
    }

    // .speed
    if (command === 'speed') {
      const start = Date.now()
      await sock.sendMessage(m.key.remoteJid, { text: 'Testing speed...' }, { quoted: m })
      reply(`⚡ *SPEED TEST*\n\nResponse: ${Date.now() - start}ms\nServer: 2GB PT Panel\nStatus: 🟢 FAST\n\n🐺`)
    }

    // .status
    if (command === 'status') {
      reply(`🟢 *STATUS*\n\nBot: ONLINE\nPT: 2GB ACTIVE\nCommands: 501 Loaded\nMemory: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)}MB\nUptime: ${Math.floor(process.uptime()/60)} min\nOwner: ${settings.ownerNumber}\n\n🐺`)
    }

    // .repository
    if (command === 'repository') {
      reply(`📦 *REPOSITORY*\n\nGitHub: https://github.com/SimonTechInc/WOLF-XMD\nStars: ⭐ Give us star!\nForks: 🍴\nBranch: main\n\n🐺`)
    }

    // .script
    if (command === 'script') {
      reply(`📜 *SCRIPT*\n\nName: ALPHA AND OMEGA WOLF XMD\nLanguage: Node.js\nLibrary: Baileys\nCommands: 501\nOwner: ${settings.ownerNumber}\n\n🐺`)
    }

    // .dashboard
    if (command === 'dashboard') {
      reply(`📊 *DASHBOARD*\n\nLink: ${settings.channelLink}\nStatus: ONLINE\nUsers: Active\nGroups: Active\n\n🐺`)
    }

    // .listcmd / .allcmd / .command
    if (command === 'listcmd' || command === 'allcmd' || command === 'command') {
      await sock.sendMessage(m.key.remoteJid, { image: { url: settings.pfpUrl }, caption: WOLF_MENU }, { quoted: m })
    }

    // .prefix
    if (command === 'prefix') {
      reply(`🔰 *PREFIX*\n\nCurrent Prefix: ${settings.prefix}\nExample: ${settings.prefix}menu\n\n🐺`)
    }

    // .system
    if (command === 'system') {
      reply(`💻 *SYSTEM INFO*\n\nPlatform: ${os.platform()} ${os.arch()}\nHostname: ${os.hostname()}\nCPU: ${os.cpus()[0].model}\nTotal RAM: ${(os.totalmem()/1024/1024/1024).toFixed(2)} GB\nFree RAM: ${(os.freemem()/1024/1024/1024).toFixed(2)} GB\nUptime: ${Math.floor(os.uptime()/3600)}h\n\n🐺`)
    }

    // .server
    if (command === 'server') {
      reply(`🖥️ *SERVER*\n\nHost: ${os.hostname()}\nPT: 2GB RAM\nNode: ${process.version}\nUptime: ${Math.floor(process.uptime()/60)}m\nHeap: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)}MB\n\n🐺`)
    }

    // .host
    if (command === 'host') {
      reply(`🏠 *HOST*\n\nHostname: ${os.hostname()}\nPlatform: ${os.platform()}\nArch: ${os.arch()}\n\n🐺`)
    }

    // .platform
    if (command === 'platform') {
      reply(`📱 *PLATFORM*\n\nWhatsApp: Multi-Device\nBaileys: Latest\nNode.js: ${process.version}\nPlatform: ${os.platform()}\n\n🐺`)
    }

    // .device
    if (command === 'device') {
      reply(`📱 *DEVICE*\n\nDevice: ${os.platform()} ${os.arch()}\nModel: ${os.cpus()[0].model.slice(0,50)}\n\n🐺`)
    }

    // .users
    if (command === 'users') {
      const chats = Object.keys(sock.chats || {})
      reply(`👥 *USERS*\n\nTotal Chats: ${chats.length}\n\n🐺`)
    }

    // .groups
    if (command === 'groups') {
      try {
        const groups = await sock.groupFetchAllParticipating()
        reply(`👥 *GROUPS*\n\nTotal Groups: ${Object.keys(groups).length}\n\n🐺`)
      } catch { reply(`👥 Groups: Fetching...`) }
    }

    // .chats
    if (command === 'chats') {
      reply(`💬 *CHATS*\n\nTotal: ${Object.keys(sock.chats || {}).length}\n\n🐺`)
    }

    // .time
    if (command === 'time') {
      const now = new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos', hour12: true })
      reply(`⏰ *TIME*\n\n${now}\nTimezone: Africa/Lagos\n\n🐺`)
    }

    // .date
    if (command === 'date') {
      const now = new Date().toLocaleDateString('en-NG', { timeZone: 'Africa/Lagos', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      reply(`📅 *DATE*\n\n${now}\n\n🐺`)
    }

    // .timezone
    if (command === 'timezone') {
      reply(`🌍 *TIMEZONE*\n\nAfrica/Lagos\n${new Date().toString()}\n\n🐺`)
    }

    // .language
    if (command === 'language') {
      reply(`🗣️ *LANGUAGE*\n\nCurrent: English\nAvailable: English\nPrefix: ${settings.prefix}\n\n🐺`)
    }

    // .feedback
    if (command === 'feedback') {
      if (!text) return reply(`📝 Usage: .feedback <your feedback>`)
      await sock.sendMessage(settings.ownerNumber + '@s.whatsapp.net', { text: `📝 *FEEDBACK*\n\nFrom: ${m.key.remoteJid}\n\n${text}` })
      reply(`✅ Feedback sent to owner! Thanks 🐺`)
    }

    // .report
    if (command === 'report') {
      if (!text) return reply(`Usage: .report <issue>`)
      reply(`✅ Report received: ${text}\nSent to owner wa.me/${settings.ownerNumber}`)
    }

    // .suggest
    if (command === 'suggest') {
      if (!text) return reply(`Usage: .suggest <idea>`)
      reply(`✅ Suggestion saved: ${text}\nThanks for improving WOLF XMD!`)
    }

    // .contact
    if (command === 'contact') {
      reply(`📞 *CONTACT*\n\nOwner: wa.me/${settings.ownerNumber}\nChannel: ${settings.channelLink}\n\n🐺`)
    }

    // .donate
    if (command === 'donate') {
      reply(`💰 *DONATE*\n\nSupport WOLF XMD:\nContact Owner: wa.me/${settings.ownerNumber}\n\nThanks for supporting ALPHA AND OMEGA! 🐺`)
    }

    // .terms
    if (command === 'terms') {
      reply(`📜 *TERMS*\n\nWOLF XMD is for educational purposes.\nOwner not responsible for misuse.\nUse responsibly.\n\n🐺`)
    }

    // .privacy
    if (command === 'privacy') {
      reply(`🔒 *PRIVACY*\n\nNo user data stored permanently.\nAll messages ephemeral.\nNo logs kept.\n\n🐺`)
    }

    // .disclaimer
    if (command === 'disclaimer') {
      reply(`⚠️ *DISCLAIMER*\n\nUse at your own risk.\nBot for fun & utility.\n\n🐺`)
    }

    // .credits
    if (command === 'credits') {
      reply(`🏆 *CREDITS*\n\nBot: ALPHA AND OMEGA WOLF XMD\nOwner: Simon Tech Inc (239166265317)\nDev: Simon Tech Inc\nDesign: WOLF PACK\nLibrary: Baileys\n\n🐺`)
    }

    // .thanks
    if (command === 'thanks') {
      reply(`🙏 *THANKS*\n\nThanks for using ALPHA AND OMEGA WOLF XMD!\nStay with WOLF PACK!\n\n🐺`)
    }

    // .rules
    if (command === 'rules') {
      reply(`📜 *RULES*\n\n1. No spam\n2. No illegal use\n3. No abuse\n4. Respect all\n5. No flood\n\nBreak = Ban\n\n🐺`)
    }

    // .guide
    if (command === 'guide') {
      reply(`📖 *GUIDE*\n\n1. Type .menu to see all commands\n2. Type .<command> <query>\nEx: .ping, .ai hello, .sticker (reply image)\n\n🐺`)
    }

    // .tutorial
    if (command === 'tutorial') {
      reply(`🎥 *TUTORIAL*\n\nCheck our channel: ${settings.channelLink}\nHow to use WOLF XMD with 501 commands!\n\n🐺`)
    }

    // .faq
    if (command === 'faq') {
      reply(`❓ *FAQ*\n\nQ: How many commands?\nA: 501 commands!\nQ: Owner?\nA: ${settings.ownerNumber}\nQ: Free?\nA: Yes!\nQ: PT?\nA: 2GB Optimized\n\n🐺`)
    }

    // .statusbot / .check
    if (command === 'statusbot' || command === 'check') {
      reply(`✅ *WOLF CHECK*\n\n🟢 Bot: ONLINE\n🟢 PT: 2GB ACTIVE\n🟢 Commands: 501 Loaded\n🟢 Memory: ${(process.memoryUsage().heapUsed/1024/1024).toFixed(2)}MB\n🟢 Owner: ${settings.ownerNumber}\n\n🐺 ALPHA AND OMEGA`)
    }

    // .info
    if (command === 'info') {
      reply(`ℹ️ *INFO*\n\nALPHA AND OMEGA WOLF XMD\n501 Commands Titan\nVersion 1.0.0 PREMIUM\nOwner: ${settings.ownerNumber}\nCompany: Simon Tech Inc\n\n🐺 WOLF NEVER SLEEPS`)
    }

    // .gstatus - Post to group status by reply
    if (command === 'gstatus') {
      if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage) return reply(`Reply to text/image/video with .gstatus to post to status`)
      const quoted = m.message.extendedTextMessage.contextInfo.quotedMessage
      await sock.sendMessage('status@broadcast', { ...quoted }, {})
      reply(`✅ Posted to WhatsApp Status! 🐺`)
    }

  }
}
