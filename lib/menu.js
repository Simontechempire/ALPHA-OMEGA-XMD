// 🐺 ALPHA AND OMEGA WOLF XMD - MENU - TYPE 2 RENDER DASHBOARD - 710 CMD
const settings = require('../settings')

function runtime(s){
  s=Number(s);let d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=Math.floor(s%60);
  return `${d}d ${h}h ${m}m ${sec}s`
}

const WOLF_MENU = `
⧉━━━〔 WOLF CIRCUIT  〕━━━⧉
   ALPHA AND OMEGA XMD
⧉━━━━━━━━━━━━━━━━━━━━━━━━━━━━⧉

◈ SYSTEM - TYPE 2 ◈
├─ Bot » ${settings.botName}
├─ Ver » 2.5.0 TYPE 2 PREMIUM
├─ Owner » ${settings.ownerName} - ${settings.ownerNumber}
├─ Prefix » ${settings.prefix}
├─ Mode » ${settings.mode.toUpperCase()}
├─ Platform » Render / Prince Host
├─ Session » WOLF~ TYPE 2 ENV
├─ Alive » ${settings.aliveImg ? 'Custom' : 'Default'}
├─ Status » ACTIVE 🟢 TYPE 2
├─ Uptime » ${runtime(process.uptime())}
├─ Auto React » ${settings.auto.autoReact ? 'ON' : 'OFF'}
├─ Auto Bio » ${settings.auto.autoBio ? 'ON' : 'OFF'}
├─ AntiLink » ${settings.auto.antiLink ? 'ON' : 'OFF'}
├─ AntiDelete » ${settings.auto.antidelete ? 'ON - '+settings.auto.antiDelPath : 'OFF'}
└─ Cmds » 710 TYPE 2

⧉━ 1. MAIN & GENERAL ⧉
├─ .menu .help .ping .alive
├─ .runtime .owner .botinfo
├─ .support .about .version
├─ .speed .uptime .status
├─ .dashboard .listcmd .allcmd

⧉━ 2. AI & CHATBOTS - GEMINI ⧉
├─ .ai .gpt .gemini .llama
├─ .ask .imagine .translate
├─ .define .explain .code
├─ .Need GEMINI_API_KEY in ENV

⧉━ 3. IMAGE & STICKER ⧉
├─ .sticker .s .toimg .take
├─ .removebg .meme .logo .attp
├─ .emojimix .circle .wanted
├─ .remini .upscale .tojpeg

⧉━ 4. DOWNLOADS & MUSIC ⧉
├─ .play .song .video
├─ .ytmp3 .ytmp4 .tiktok
├─ .facebook .instagram .mediafire
├─ .spotify .twitter .pinterest
├─ .lyrics .shazam .ytsearch

⧉━ 5. GROUP ADMINISTRATION ⧉
├─ .kick .add .promote .demote
├─ .tagall .hidetag .admins
├─ .mute .unmute .revoke
├─ .setgrouppic .approve .poll
├─ .welcome (AUTO if WELCOME=true)

⧉━ 6. PROTECTION & MODERATION ⧉
├─ .antilink (or AUTO via ENV ANTI_LINK=true)
├─ .antispam .antibot .warn
├─ .ban .unban .delete .purge
├─ .antibadword .antifake .raidmode

⧉━ 7. AUTO FEATURES - TYPE 2 DASHBOARD ⧉
├─ These are controlled from Render ENV:
├─ AUTO_READ, AUTO_TYPING, AUTO_RECORDING
├─ AUTO_VIEW_STATUS, AUTO_LIKE_STATUS
├─ AUTO_REACT, HEART_REACT, OWNER_REACT
├─ STATUS_REACT, AUTO_REPLY_STATUS
├─ ANTI_92, ANTI_LINK, ANTI_BAD, ANTI_CALL
├─ ANTI_SPAM, AUTO_BIO, WELCOME
├─ FAKE_RECORDING, DM_PRESENCE, GRP_PRESENCE
├─ AUTO_DOWNLOAD, AUTO_VOICE, AUTO_STICKER

⧉━ 8. TOOLS & UTILITIES ⧉
├─ .autotyping .autorecording .autoreact
├─ .calculator .qr .shorten .password
├─ .base64 .binary .hash .translatefile
├─ .screenshot .systeminfo

⧉━ 9. OWNER & BOT MANAGEMENT ⧉
├─ .setprefix .setbio .restart .broadcast
├─ .public .private .self .mode
├─ .eval .exec .backup .stats

⧉━ 10. RENDER DASHBOARD VARS ⧉
├─ SESSION_ID (Required) = WOLF~...
├─ PREFIX, MODE, OWNER_NUMBER, BOT_NAME
├─ ALIVE_IMG, ALIVE_MSG, AUTO_BIO
├─ AUTO_READ, AUTO_TYPING, AUTO_VIEW_STATUS
├─ GEMINI_API_KEY for AI
├─ ANTI_DEL_PATH=log or same

⧉━━━━━━━━━━━━━━━━━━━━⧉
  🐺 WOLF SYSTEM TYPE 2
  RENDER + PRINCE HOST READY
  POWERED BY ALPHA AND OMEGA
  SIMON TECH INC © 2026
⧉━━━━━━━━━━━━━━━━━━━━⧉
`

async function sendWolfMenu(sock, chatId, m) {
  const channelLink = "https://whatsapp.com/channel/0029Vb97vPwChq6GqI44n61S"
  const invisibleChannel = `\u200B${channelLink}`
  
  await sock.sendMessage(chatId, {
    text: WOLF_MENU + `\n${invisibleChannel}`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363405065075853@newsletter",
        newsletterName: "ALPHA AND OMEGA WOLF XMD - TYPE 2",
        serverMessageId: 1
      },
      externalAdReply: {
        title: "🐺 ALPHA AND OMEGA WOLF XMD TYPE 2",
        body: `Mode: ${settings.mode} | Prefix: ${settings.prefix} | ${settings.ownerName}`,
        thumbnailUrl: settings.aliveImg || settings.pfpUrl,
        sourceUrl: channelLink,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

module.exports = { WOLF_MENU, sendWolfMenu }
