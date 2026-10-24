// 🐺 ALPHA AND OMEGA WOLF XMD - SETTINGS - TYPE 2 RENDER DASHBOARD EDITION
// Compatible with Prince Host / KERM Style Dashboard
require('dotenv').config();
const fs = require('fs');

module.exports = {
  // ===== BOT INFO - From Dashboard ENV =====
  botName: process.env.BOT_NAME || "ALPHA AND OMEGA",
  botFull: "🐺 𓃵 ALPHA AND OMEGA 𓃵 🐺",
  version: "2.5.0 PREMIUM - 700 CMDS - TYPE 2",
  prefix: process.env.PREFIX || ".",
  
  // ===== SESSION - TYPE 2 CORE =====
  // This is pasted from your Pair Site DM
  SESSION_ID: process.env.SESSION_ID || "",
  
  // ===== OWNER - From Dashboard ENV =====
  ownerNumber: process.env.OWNER_NUMBER || "239166265317",
  owner: [
    (process.env.OWNER_NUMBER || "239166265317").replace(/[^0-9]/g, ""),
    (process.env.OWNER_NUMBER || "239166265317").replace(/[^0-9]/g, "") + "@s.whatsapp.net",
    (process.env.OWNER_NUMBER || "239166265317")
  ],
  // Extra owners from comma list
  extraOwners: (process.env.OWNER_NUMBER || "").split(",").map(n => n.trim().replace(/[^0-9]/g, "")).filter(n => n),
  ownerName: process.env.OWNER_NAME || "Simon Tech Inc",
  company: process.env.OWNER_NAME || "Simon Tech Inc",
  userLid: process.env.USER_LID || "",
  
  // ===== MODE & PRESENCE =====
  mode: process.env.MODE || "public", // public, private, self, inbox, group
  dmPresence: process.env.DM_PRESENCE || "typing", // typing, recording, online
  grpPresence: process.env.GRP_PRESENCE || "recording",
  
  // ===== LINKS & MEDIA =====
  pfpUrl: process.env.ALIVE_IMG || "https://files.catbox.moe/gqz6zv.jpg",
  aliveImg: process.env.ALIVE_IMG || "https://files.catbox.moe/gqz6zv.jpg",
  aliveMsg: process.env.ALIVE_MSG || "_Hi bro am alive now🥷🏽🤝🏾._\n\n🐺 ALPHA AND OMEGA WOLF XMD ONLINE!",
  channelLink: "https://whatsapp.com/channel/0029Vb97vPwChq6GqI44n61S",
  channelJid: "120363405065075853@newsletter",
  
  // ===== SYSTEM =====
  totalCmd: 710,
  port: process.env.PORT || 3000,
  pairing: false, // TYPE 2 - No pairing in bot, pairing is in pair site
  autoJoinChannel: true,
  
  // ===== STICKER =====
  packName: process.env.BOT_NAME || "ALPHA AND OMEGA WOLF",
  packAuthor: process.env.OWNER_NAME || "Simon Tech Inc",
  pack: "🐺 WOLF XMD",
  
  // ===== AUTO FEATURES - 100% Dashboard Controlled =====
  // All read from Render Dashboard ENV
  auto: {
    // Old WOLF features
    autovv: true,
    antidelete: process.env.ANTI_DEL_PATH ? true : true,
    antiDelPath: process.env.ANTI_DEL_PATH || "log",
    
    // Dashboard toggles
    autoRecording: process.env.AUTO_RECORDING === "true" || process.env.FAKE_RECORDING === "true",
    autoTyping: process.env.AUTO_TYPING === "true",
    autoRecordType: process.env.AUTO_RECORD_TYPE === "true",
    autoRead: process.env.AUTO_READ === "true" || process.env.READ_MESSAGE === "true",
    readCmd: process.env.READ_CMD === "true" || process.env.READ_CMD === undefined ? true : false,
    autoBio: process.env.AUTO_BIO === "true",
    anti92: process.env.ANTI_92 === "true",
    autoViewStatus: process.env.AUTO_VIEW_STATUS === "true" || process.env.AUTO_READ_STATUS === "true",
    welcome: process.env.WELCOME === "true" || process.env.WELCOME === undefined ? true : false,
    autoReact: process.env.AUTO_REACT === "true",
    ownerReact: process.env.OWNER_REACT === "true",
    heartReact: process.env.HEART_REACT === "true",
    statusReact: process.env.STATUS_REACT === "true",
    autoReplyStatus: process.env.AUTO_REPLY_STATUS === "true",
    statusReply: process.env.STATUS_REPLY || "Merci pour ton statut ❤️",
    autoLikeStatus: process.env.AUTO_LIKE_STATUS === "true",
    
    // Advanced
    autoVoice: process.env.AUTO_VOICE === "true",
    autoReply: process.env.AUTO_REPLY === "true",
    autoSticker: process.env.AUTO_STICKER === "true",
    antiLink: process.env.ANTI_LINK === "true",
    antiBad: process.env.ANTI_BAD === "true",
    antiCall: process.env.ANTI_CALL === "true",
    antiSpam: process.env.ANTI_SPAM === "true",
    autoDownload: process.env.AUTO_DOWNLOAD === "true",
    
    // Default emoji
    reactEmoji: '🐺'
  },
  
  // ===== API KEYS =====
  geminiKey: process.env.GEMINI_API_KEY || "",
  
  // ===== NSFW & ECONOMY =====
  nsfw: false,
  economy: {
    startMoney: 1000,
    dailyAmount: 5000
  },
  
  // ===== MESSAGES =====
  mess: {
    owner: "🐺 Owner only! This command is for Simon Tech Inc only! 👑",
    group: "👥 This command is for groups only!",
    admin: "👑 Admin only! You need to be admin!",
    botAdmin: "🤖 Bot needs to be admin!",
    wait: "⏳ WOLF is processing... 🐺",
    done: "✅ Done! 🐺 ALPHA AND OMEGA",
    nsfw: "🔞 NSFW disabled in this group! Owner use .antinsfw off",
    viewonce: "👁️ Reply view-once message with .vv to bypass!",
    sessionMissing: "❌ SESSION_ID Missing! Go to your Pair Site and get WOLF~ session and paste it in Render Dashboard ENV."
  }
};

// Validation for TYPE 2
if (!module.exports.SESSION_ID) {
  console.log("\n[WOLF TYPE 2] ⚠️  SESSION_ID not found in ENV! Bot will not connect.");
  console.log("[WOLF TYPE 2] Get session from Pair Site and put in Render Dashboard -> SESSION_ID\n");
}
