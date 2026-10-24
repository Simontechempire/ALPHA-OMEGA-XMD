// 🐺 ALPHA AND OMEGA WOLF XMD - MENU - 500 CMD - CIRCUIT + CHANNEL BUTTON
const settings = require('../settings')

function runtime(s){
  s=Number(s);let d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),sec=Math.floor(s%60);
  return `${d}d ${h}h ${m}m ${sec}s`
}

const WOLF_MENU = `
⧉━━━〔 WOLF CIRCUIT 〕━━━⧉
   ALPHA AND OMEGA XMD
⧉━━━━━━━━━━━━━━━━━━━━⧉

◈ SYSTEM ◈
├─ Bot » ALPHA AND OMEGA
├─ Ver » 1.0.0 PREMIUM
├─ Owner » ${settings.ownerNumber}
├─ Prefix » ${settings.prefix}
├─ Platform » WhatsApp
├─ Engine » Node.js
├─ Status » ACTIVE 🟢
├─ Uptime » ${runtime(process.uptime())}
└─ Cmds » 500

⧉━ 1. MAIN & GENERAL ⧉
├─ .menu
├─ .help
├─ .ping
├─ .alive
├─ .runtime
├─ .owner
├─ .botinfo
├─ .support
├─ .about
├─ .version
├─ .speed
├─ .uptime
├─ .status
├─ .repository
├─ .script
├─ .dashboard
├─ .listcmd
├─ .allcmd
├─ .command
├─ .prefix
├─ .system
├─ .server
├─ .host
├─ .platform
├─ .device
├─ .users
├─ .groups
├─ .chats
├─ .time
├─ .date
├─ .timezone
├─ .language
├─ .feedback
├─ .report
├─ .suggest
├─ .contact
├─ .donate
├─ .terms
├─ .privacy
├─ .disclaimer
├─ .credits
├─ .thanks
├─ .rules
├─ .guide
├─ .tutorial
├─ .faq
├─ .statusbot
├─ .check
└─ .info

⧉━ 2. AI & CHATBOTS ⧉
├─ .ai
├─ .gpt
├─ .chatgpt
├─ .gemini
├─ .llama
├─ .deepseek
├─ .claude
├─ .copilot
├─ .perplexity
├─ .ask
├─ .imagine
├─ .translate
├─ .summarize
├─ .define
├─ .explain
├─ .rewrite
├─ .grammar
├─ .paraphrase
├─ .essay
├─ .story
├─ .poem
├─ .code
├─ .debug
├─ .javascript
├─ .python
├─ .html
├─ .css
├─ .nodejs
├─ .sql
├─ .regex
├─ .math
├─ .solve
├─ .homework
├─ .quiz
├─ .tutor
├─ .languageai
├─ .emailai
├─ .caption
├─ .bioai
├─ .businessai
├─ .marketingai
├─ .resumeai
├─ .interviewai
├─ .ideas
├─ .plan
├─ .recipeai
├─ .travelai
├─ .sentiment
└─ .aiclear

⧉━ 3. IMAGE & STICKER ⧉
├─ .sticker
├─ .s
├─ .toimg
├─ .take
├─ .blur
├─ .enhance
├─ .removebg
├─ .photo
├─ .meme
├─ .logo
├─ .attp
├─ .ttp
├─ .emojimix
├─ .circle
├─ .crop
├─ .resize
├─ .rotate
├─ .flip
├─ .greyscale
├─ .sepia
├─ .wanted
├─ .trigger
├─ .wasted
├─ .jail
├─ .passed
├─ .beautiful
├─ .facepalm
├─ .deletebg
├─ .remini
├─ .upscale
├─ .compress
├─ .png
├─ .jpg
├─ .webp
├─ .gif
├─ .tojpeg
├─ .tomp4
├─ .togif
├─ .stickerinfo
├─ .stickerpack
├─ .extract
├─ .pixelate
├─ .invert
├─ .brightness
├─ .contrast
├─ .sharpen
├─ .sketch
├─ .cartoon
├─ .anime
└─ .wallpaperai

⧉━ 4. DOWNLOADS & MUSIC ⧉
├─ .play
├─ .song
├─ .video
├─ .ytmp3
├─ .ytmp4
├─ .tiktok
├─ .facebook
├─ .instagram
├─ .mediafire
├─ .spotify
├─ .youtube
├─ .twitter
├─ .xvideo
├─ .pinterest
├─ .threads
├─ .reddit
├─ .gdrive
├─ .mega
├─ .soundcloud
├─ .audiomack
├─ .lyrics
├─ .shazam
├─ .ytaudio
├─ .ytvideo
├─ .ytsearch
├─ .ttsearch
├─ .igstory
├─ .igprofile
├─ .fbvideo
├─ .fbphoto
├─ .twvideo
├─ .pinsearch
├─ .pinvideo
├─ .pinaudio
├─ .direct
├─ .fetch
├─ .download
├─ .dl
├─ .media
├─ .audio
├─ .document
├─ .fileinfo
├─ .filesize
├─ .compressvideo
├─ .convertmp3
├─ .convertmp4
├─ .trim
├─ .mergeaudio
├─ .videoinfo
└─ .playlist

⧉━ 5. GROUP ADMINISTRATION ⧉
├─ .kick
├─ .add
├─ .promote
├─ .demote
├─ .tagall
├─ .hidetag
├─ .admins
├─ .groupinfo
├─ .mute
├─ .unmute
├─ .open
├─ .close
├─ .revoke
├─ .newlink
├─ .resetlink
├─ .invite
├─ .join
├─ .leave
├─ .setname
├─ .setdesc
├─ .setsubject
├─ .setgrouppic
├─ .getgrouppic
├─ .groupname
├─ .groupdesc
├─ .membercount
├─ .members
├─ .listonline
├─ .listadmin
├─ .listmember
├─ .everyone
├─ .tagadmin
├─ .tagmember
├─ .kickall
├─ .promoteall
├─ .demoteall
├─ .group
├─ .antidelete
├─ .welcome
├─ .goodbye
├─ .setwelcome
├─ .setgoodbye
├─ .delwelcome
├─ .delgoodbye
├─ .approve
├─ .reject
├─ .requests
├─ .poll
└─ .vote

⧉━ 6. PROTECTION & MODERATION ⧉
├─ .antilink
├─ .antispam
├─ .antibot
├─ .antitag
├─ .antiflood
├─ .warn
├─ .warnings
├─ .resetwarn
├─ .clearwarn
├─ .ban
├─ .unban
├─ .block
├─ .unblock
├─ .delete
├─ .del
├─ .purge
├─ .clear
├─ .slowmode
├─ .lock
├─ .unlock
├─ .antibadword
├─ .badword
├─ .addbadword
├─ .delbadword
├─ .listbadword
├─ .antimention
├─ .antifake
├─ .antiscam
├─ .antiphish
├─ .antivirtex
├─ .antiforward
├─ .antimedia
├─ .antisticker
├─ .antigif
├─ .antidocument
├─ .antiaudio
├─ .antivideo
├─ .antipicture
├─ .antipoll
├─ .antichannel
├─ .antigroup
├─ .antipromote
├─ .antidemote
├─ .raidmode
├─ .security
├─ .modlogs
├─ .setwarn
└─ .resetprotection

⧉━ 7. SEARCH & INFORMATION ⧉
├─ .google
├─ .wikipedia
├─ .weather
├─ .news
├─ .lyrics
├─ .github
├─ .npm
├─ .movie
├─ .anime
├─ .wallpaper
├─ .image
├─ .images
├─ .search
├─ .web
├─ .bing
├─ .duckduckgo
├─ .defineword
├─ .dictionary
├─ .synonym
├─ .antonym
├─ .meaning
├─ .pronounce
├─ .country
├─ .capital
├─ .currency
├─ .exchange
├─ .timein
├─ .calendar
├─ .holidays
├─ .football
├─ .scores
├─ .fixtures
├─ .standings
├─ .cricket
├─ .technology
├─ .trending
├─ .hashtag
├─ .domain
├─ .iplookup
├─ .dnslookup
├─ .whois
├─ .shorturl
├─ .expandurl
├─ .qrread
├─ .barcode
├─ .universities
├─ .books
├─ .quotesearch
├─ .factsearch
└─ .technews

⧉━ 8. FUN & GAMES ⧉
├─ .joke
├─ .quote
├─ .fact
├─ .riddle
├─ .ship
├─ .character
├─ .truth
├─ .dare
├─ .compliment
├─ .roast
├─ .8ball
├─ .flip
├─ .coin
├─ .dice
├─ .roll
├─ .guess
├─ .trivia
├─ .quizgame
├─ .wordgame
├─ .mathgame
├─ .rps
├─ .tictactoe
├─ .hangman
├─ .scramble
├─ .wordle
├─ .chess
├─ .checkers
├─ .slots
├─ .lottery
├─ .number
├─ .random
├─ .choose
├─ .rate
├─ .shiprate
├─ .lovecalc
├─ .friend
├─ .personality
├─ .roastme
├─ .complimentme
├─ .pickup
├─ .insult
├─ .motivate
├─ .inspire
├─ .dailyquote
├─ .darkjoke
├─ .memes
├─ .factoftheday
├─ .wouldyourather
└─ .neverhaveiever

⧉━ 9. OWNER & BOT MANAGEMENT ⧉
├─ .setprefix
├─ .togcstatus
├─ .setname
├─ .setbio
├─ .restart
├─ .shutdown
├─ .broadcast
├─ .bc
├─ .blockuser
├─ .unblockuser
├─ .clearsession
├─ .ownerinfo
├─ .setowner
├─ .setppbot
├─ .setmenu
├─ .setthumb
├─ .setstatus
├─ .public
├─ .private
├─ .self
├─ .mode
├─ .maintenance
├─ .autoupdate
├─ .update
├─ .checkupdate
├─ .install
├─ .uninstall
├─ .plugin
├─ .plugins
├─ .addplugin
├─ .delplugin
├─ .reload
├─ .eval
├─ .exec
├─ .shell
├─ .getfile
├─ .savefile
├─ .delfile
├─ .backup
├─ .restore
├─ .cleardb
├─ .stats
├─ .botstats
├─ .userstats
├─ .groupstats
├─ .banuser
├─ .unbanuser
├─ .setbotpic
└─ .logs

⧉━ 10. TOOLS & UTILITIES ⧉
├─ .settings
├─ .autotyping
├─ .autorecording
├─ .autoreact
├─ .autostatus
├─ .readmessage
├─ .settimezone
├─ .setlanguage
├─ .calculator
├─ .convert
├─ .unit
├─ .percentage
├─ .bmi
├─ .stopwatch
├─ .timer
├─ .remind
├─ .note
├─ .notes
├─ .todo
├─ .qr
├─ .qrcode
├─ .shorten
├─ .password
├─ .uuid
├─ .base64
├─ .encode
├─ .decode
├─ .binary
├─ .hex
├─ .hash
├─ .md5
├─ .sha256
├─ .json
├─ .formatjson
├─ .urlencode
├─ .urldecode
├─ .color
├─ .randomcolor
├─ .textcount
├─ .wordcount
├─ .reverse
├─ .uppercase
├─ .lowercase
├─ .repeat
├─ .translatefile
├─ .screenshot
├─ .systeminfo
├─ .memory
└─ .cpu

⧉━━━━━━━━━━━━━━━━━━━━⧉
  🐺 WOLF SYSTEM
  POWERED BY ALPHA AND OMEGA
⧉━━━━━━━━━━━━━━━━━━━━⧉
`

// BUTTON HANDLER - ADD THIS IN YOUR MENU PLUGIN FILE (menu.js)
async function sendWolfMenu(sock, chatId, m) {
  const channelLink = "https://whatsapp.com/channel/0029Vb97vPwChq6GqI44n61S"
  
  // Invisible link trick: \u200B + link makes preview hidden but button works
  const invisibleChannel = `\u200B${channelLink}`
  
  await sock.sendMessage(chatId, {
    text: WOLF_MENU + `\n${invisibleChannel}`,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363198973456789@newsletter",
        newsletterName: "ALPHA AND OMEGA WOLF XMD",
        serverMessageId: 1
      },
      externalAdReply: {
        title: "🐺 ALPHA AND OMEGA WOLF XMD",
        body: "Tap to View Channel",
        thumbnailUrl: "https://i.ibb.co/your-logo.jpg",
        sourceUrl: channelLink,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    },
    // This creates the actual View Channel button
    newsletter: {
      name: "ALPHA AND OMEGA",
      inviteLink: channelLink
    }
  }, { quoted: m })

  // ALTERNATIVE METHOD 2 - Native Flow Button (Works on latest Baileys)
  /*
  await sock.sendMessage(chatId, {
    text: WOLF_MENU,
    footer: "🐺 WOLF NEVER SLEEPS",
    buttons: [
      {
        buttonId: "view_channel",
        buttonText: { displayText: "🔔 View Channel" },
        type: 1
      }
    ],
    headerType: 1,
    viewOnce: true,
    contextInfo: {
      externalAdReply: {
        title: "ALPHA AND OMEGA WOLF",
        body: "Join our official channel",
        sourceUrl: channelLink,
        mediaType: 1,
        showAdAttribution: true
      }
    }
  }, { quoted: m })
  */
}

module.exports = { WOLF_MENU, sendWolfMenu }
