// 🐺 ALPHA AND OMEGA WOLF XMD - MAIN HANDLER - 700 CMD TITAN - CONNECTED
// 2GB PT PANEL OPTIMIZED - REAL HANDLERS
const settings = require('./settings')
const { WOLF_MENU } = require('./lib/menu.js')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

// Global DB
global.wolfDB = global.wolfDB || { 
  auto: { 
    autovv: true, 
    antidelete: true, 
    autoread: false, 
    autoreadgc: false,
    autoreadpc: false,
    autotyping: false, 
    autorecording: false,
    autoreact: false,
    autoviewstatus: true,
    reactEmoji: '🐺',
    autobio: false,
    autobioText: '🐺 ALPHA AND OMEGA WOLF XMD | {time}'
  }, 
  nsfw: {}, 
  owners: ["239166265317@s.whatsapp.net", "239166265317"], 
  mode: 'public', 
  prefix: settings.prefix || '.',
  deletedCache: {}
}
global.wolfEco = global.wolfEco || { users: {} }

module.exports = async (sock) => {
  console.log(chalk.cyan(`🐺 WOLF ONE-FILE + PLUGINS HANDLER READY`))

  // ===== LOAD ALL 15 PLUGIN FILES =====
  const pluginsPath = path.join(__dirname, 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, { recursive: true })

  async function loadPlugins() {
    const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))
    let allCommands = {}
    console.log(chalk.cyan(`\n📦 Loading ${files.length} plugin files from plugins/...\n`))
    for (let file of files) {
      try {
        const filePath = path.join(pluginsPath, file)
        delete require.cache[require.resolve(filePath)]
        const plugin = require(filePath)
        if (plugin.command && plugin.execute) {
          for (let cmd of plugin.command) {
            allCommands[cmd.toLowerCase()] = plugin.execute
          }
          console.log(chalk.green(`✅ ${file} - ${plugin.command.length} cmds`))
        }
      } catch (e) {
        console.log(chalk.red(`❌ ${file}: ${e.message}`))
      }
    }
    console.log(chalk.magenta(`\n🐺 PLUGINS TOTAL: ${Object.keys(allCommands).length} CMDS\n`))
    return allCommands
  }

  let pluginCommands = await loadPlugins()

  // Auto reload on file change
  fs.watch(pluginsPath, async () => {
    console.log(chalk.yellow('🔄 Plugins changed, reloading...'))
    pluginCommands = await loadPlugins()
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message) return
    if (m.key.remoteJid === 'status@broadcast') return

    // ===== AUTO FEATURES =====
    try {
      const isViewOnce = m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension
      if (global.wolfDB.auto.autovv && isViewOnce) {
        const viewMsg = (m.message.viewOnceMessage || m.message.viewOnceMessageV2 || m.message.viewOnceMessageV2Extension).message
        await sock.sendMessage(m.key.remoteJid, { forward: viewMsg }, { quoted: m }).catch(()=>{})
        await sock.sendMessage(m.key.remoteJid, { text: `👁️ *AUTO VV BYPASSED* View-once auto saved! 🐺` }, { quoted: m }).catch(()=>{})
      }
      if (global.wolfDB.auto.autoread) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadgc && m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autotyping) await sock.sendPresenceUpdate('composing', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autorecording) await sock.sendPresenceUpdate('recording', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autoreact) await sock.sendMessage(m.key.remoteJid, { react: { text: global.wolfDB.auto.reactEmoji || '🐺', key: m.key } }).catch(()=>{})
      if (global.wolfDB.auto.antidelete) {
        global.wolfDB.deletedCache[m.key.id] = { message: m.message, key: m.key, time: Date.now() }
      }
    } catch {}

    // ===== COMMAND PARSER =====
    const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || ""
    if (!body.startsWith(settings.prefix)) return

    const args = body.slice(settings.prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase()
    const q = args.join(" ")

    const reply = async (text, opts={}) => {
      await sock.sendMessage(m.key.remoteJid, { text: text, ...opts }, { quoted: m })
    }

    const isOwner = m.key.remoteJid === settings.ownerNumber + "@s.whatsapp.net" || m.key.participant === settings.ownerNumber + "@s.whatsapp.net" || settings.owner?.includes("239166265317") || m.key.fromMe

    try {
      // ==== CORE MENU / PING / ALIVE - KEEP YOUR ORIGINAL ====
      if (command === 'menu' || command === 'help' || command === 'allcmd') {
        await sock.sendMessage(m.key.remoteJid, { 
          image: { url: settings.pfpUrl }, 
          caption: WOLF_MENU 
        }, { quoted: m })
        return
      }
      if (command === 'ping' || command === 'speed') {
        const start = Date.now()
        await reply(`🐺 PINGING WOLF...\n`)
        const end = Date.now()
        await reply(`⚡ WOLF SPEED: ${end - start}ms\n🟢 ACTIVE\n🐺 ALPHA AND OMEGA\n📦 Plugins: ${Object.keys(pluginCommands).length} cmds`)
        return
      }
      if (command === 'alive') {
        await sock.sendMessage(m.key.remoteJid, {
          image: { url: settings.pfpUrl },
          caption: `🐺 *ALPHA AND OMEGA IS ALIVE!*\n\n⚡ Version: 2.5.0 PREMIUM\n📚 Commands: ${Object.keys(pluginCommands).length}+ Real\n👑 Owner: ${settings.ownerNumber}\n🏢 Simon Tech Inc\n🟢 Status: ONLINE\n📦 15 Plugins Connected\n\n*WOLF NEVER SLEEPS*`
        }, { quoted: m })
        return
      }
      if (command === 'owner') {
        await reply(`👑 OWNER INFO\n\nName: Simon Tech Inc\nNumber: ${settings.ownerNumber}\nCompany: Simon Tech Inc\nChannel: ${settings.channelLink}\n\n📦 Plugins: ${Object.keys(pluginCommands).length} active`)
        return
      }
      if (command === 'runtime' || command === 'uptime') {
        const up = process.uptime()
        const d = Math.floor(up / 86400)
        const h = Math.floor((up % 86400) / 3600)
        const mm = Math.floor((up % 3600) / 60)
        const s = Math.floor(up % 60)
        await reply(`⏰ *RUNTIME*\n\n${d}d ${h}h ${mm}m ${s}s\n\n🐺 WOLF XMD - ${Object.keys(pluginCommands).length} cmds`)
        return
      }

      // ==== TRY PLUGIN COMMANDS FIRST - REAL HANDLERS ====
      if (pluginCommands[command]) {
        if (global.wolfDB.mode === 'self' && !isOwner) return
        console.log(chalk.yellow(`[PLUGIN CMD] ${command} - ${q.slice(0,30)}`))
        await pluginCommands[command](sock, m, {
          command,
          text: q,
          args,
          reply,
          isOwner,
          prefix: settings.prefix
        })
        return
      }

      // ==== FALLBACK - YOUR ORIGINAL PLACEHOLDER LOGIC ====
      if (['ai','gpt','chatgpt','gemini','ask'].includes(command)) {
        if (!q) return reply(`🤖 Usage: .${command} <question>\nEx: .${command} who is WOLF?`)
        await reply(`🤖 *WOLF AI*\n\nQ: ${q}\n\nA: Connect your API in settings.js for real AI. But try .gpt from plugins for real AI!\n\n🐺 ALPHA AND OMEGA`)
        return
      }
      if (command === 'joke') { await reply(`😂 WOLF JOKE:\n\nWhy did the wolf join WOLF XMD?\nBecause he wanted to be ALPHA! 🐺`); return }
      if (command === 'quote') { await reply(`💭 "WOLF NEVER SLEEPS - ALPHA AND OMEGA" 🐺`); return }
      if (command === 'dice' || command === 'roll') { await reply(`🎲 You rolled: ${Math.floor(Math.random()*6)+1}`); return }
      if (command === 'coin' || command === 'flip') { await reply(`🪙 ${Math.random()>0.5?'HEAD':'TAIL'} 🐺`); return }
      if (command === 'restart') {
        if (!isOwner) return reply(settings.mess.owner)
        await reply(`🔄 Restarting WOLF XMD...`)
        process.exit(0)
      }

      // Generic reply for unknown
      if (command.length > 1) {
        await reply(`🐺 *${command.toUpperCase()}*\n\n❌ Not found in ${Object.keys(pluginCommands).length} cmds\n\nTry .menu to see all cmds\n\n⚡ WOLF XMD`)
      }

    } catch (e) {
      console.log(chalk.red(`WOLF Error ${command}:`), e.message)
    }
  })

  // ===== ANTI DELETE =====
  sock.ev.on('messages.update', async updates => {
    for (let upd of updates) {
      try {
        if (upd.update.message === null && global.wolfDB.auto.antidelete) {
          const cached = global.wolfDB.deletedCache?.[upd.key.id]
          if (cached) {
            const participant = upd.key.participant || upd.key.remoteJid
            await sock.sendMessage(upd.key.remoteJid, { 
              text: `🚫 *ANTI-DELETE*\n@${participant.split('@')[0]} deleted a message! Recovered:`,
              mentions: [participant]
            }).catch(()=>{})
            await sock.sendMessage(upd.key.remoteJid, { forward: cached.message }).catch(()=>{})
          }
        }
      } catch {}
    }
  })

  console.log(chalk.green(`🐺 main.js READY - ${Object.keys(pluginCommands).length} PLUGIN CMDS CONNECTED!`))
  }
