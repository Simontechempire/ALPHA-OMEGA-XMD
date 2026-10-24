settings.js
// 🐺 ALPHA AND OMEGA WOLF XMD - SETTINGS - 700 CMD TITAN
module.exports = {
  // BOT INFO
  botName: "ALPHA AND OMEGA",
  botFull: "🐺 𓃵 ALPHA AND OMEGA 𓃵 🐺",
  version: "2.5.0 PREMIUM - 700 CMDS",
  prefix: ".",
  
  // OWNER - YOUR NUMBER
  ownerNumber: "239166265317",
  owner: ["239166265317","239166265317@s.whatsapp.net","239166265317"],
  ownerName: "Simon Tech Inc",
  company: "Simon Tech Inc",
  
  // LINKS
  pfpUrl: "https://files.catbox.moe/gqz6zv.jpg",
  channelLink: "https://whatsapp.com/channel/0029Vb97vPwChq6GqI44n61S",
  channelJid: "120363405065075853@newsletter", // Fixed your old ID
  
  // SYSTEM
  totalCmd: 710,
  port: process.env.PORT || 3000,
  pairing: true,
  autoJoinChannel: true,
  
  // STICKER
  packName: "ALPHA AND OMEGA WOLF",
  packAuthor: "Simon Tech Inc",
  pack: "🐺 WOLF XMD",
  
  // AUTO FEATURES DEFAULT
  auto: {
    autovv: true, // Auto bypass view once
    antidelete: true,
    autoread: true,
    autotyping: true,
    autoreact: true,
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
