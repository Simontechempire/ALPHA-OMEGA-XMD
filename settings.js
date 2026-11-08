// 🐺 ALPHA AND OMEGA WOLF XMD - SETTINGS - FAST FIX - COMMANDS 100% SAME
module.exports = {
  // BOT INFO
  botName: "ALPHA AND OMEGA",
  botFull: "🐺 𓃵 ALPHA AND OMEGA 𓃵 🐺",
  version: "2.5.0 PREMIUM",
  prefix: ".",
  
  // OWNER - YOUR NUMBER
  ownerNumber: "239166265317",
  owner: ["239166265317","239166265317@s.whatsapp.net"],
  ownerName: "Simon Tech Inc",
  company: "Simon Tech Inc",
  
  // LINKS
  pfpUrl: "https://files.catbox.moe/gqz6zv.jpg",
  channelLink: "https://whatsapp.com/channel/0029Vb97vPwChq6GqI44n61S",
  channelJid: "120363405065075853@newsletter",
  
  // SYSTEM
  totalCmd: 0, // Real count is calculated by main.js from plugins/, no fake number
  port: process.env.PORT || 3000,
  pairing: true,
  autoJoinChannel: false, // FIX: OFF - no delay on connect, join channel manually
  
  // STICKER
  packName: "ALPHA AND OMEGA WOLF",
  packAuthor: "Simon Tech Inc",
  pack: "🐺 WOLF XMD",
  
  // AUTO FEATURES DEFAULT - ALL OFF FOR SPEED
  // Turn ON only if you want it, with command later. OFF = fast .ping
  auto: {
    autovv: false,
    antidelete: false,
    autoread: false,
    autotyping: false,
    autoreact: false,
    reactEmoji: '🐺'
  },
  
  // NSFW
  nsfw: false, // Family friendly default
  
  // ECONOMY
  economy: {
    startMoney: 1000,
    dailyAmount: 5000
  },
  
  // MESSAGES
  mess: {
    owner: "🐺 Owner only! This command is for Simon Tech Inc only! 👑",
    group: "👥 This command is for groups only!",
    admin: "👑 Admin only! You need to be admin!",
    botAdmin: "🤖 Bot needs to be admin!",
    wait: "⏳ WOLF is processing... 🐺",
    done: "✅ Done! 🐺 ALPHA AND OMEGA",
    nsfw: "🔞 NSFW disabled in this group! Owner use .antinsfw off",
    viewonce: "👁️ Reply view-once message with .vv to bypass!"
  }
}
