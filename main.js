// 🐺 ALPHA AND OMEGA WOLF XMD - MAIN.JS FINAL - 700 CMD TITAN - RENDER READY
// Owner: 239166265317 | Simon Tech Inc | 15 Plugins
const settings = require('./settings')
const { WOLF_MENU } = require('./lib/menu.js')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

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
    autolikestatus: false,
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
  console.log(chalk.cyan(`🐺 WOLF MAIN HANDLER READY - RENDER EDITION`))

  const pluginsPath = path.join(__dirname, 'plugins')
  if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, { recursive: true })

  async function loadPlugins() {
    const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'))
    let allCommands = {}
    console.log(chalk.cyan(`\n📦 Loading ${files.length} plugin files...\n`))
    for (let file of files) {
      try {
        const filePath = path.join(pluginsPath, file)
        delete require.cache[require.resolve(filePath)]
        const plugin = require(filePath)
        if (plugin.command && plugin.execute) {
          for (let cmd of plugin.command) {
            const clean = cmd.toLowerCase().trim()
            allCommands[clean] = plugin.execute
            // also clean version without symbols
            const clean2 = clean.replace(/[^a-z0-9]/g,'')
            if(clean2) allCommands[clean2] = plugin.execute
          }
          console.log(chalk.green(`✅ ${file} - ${plugin.command.length} cmds`))
        }
      } catch (e) {
        console.log(chalk.red(`❌ ${file}: ${e.message}`))
      }
    }
    console.log(chalk.magenta(`\n🐺 TOTAL: ${Object.keys(allCommands).length} CMDS LOADED\n`))
    return allCommands
  }

  let pluginCommands = await loadPlugins()

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
      }
      if (global.wolfDB.auto.autoread) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadgc && m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autoreadpc && !m.key.remoteJid.endsWith('@g.us')) await sock.readMessages([m.key]).catch(()=>{})
      if (global.wolfDB.auto.autotyping) await sock.sendPresenceUpdate('composing', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autorecording) await sock.sendPresenceUpdate('recording', m.key.remoteJid).catch(()=>{})
      if (global.wolfDB.auto.autoreact) await sock.sendMessage(m.key.remoteJid, { react: { text: global.wolfDB.auto.reactEmoji || '🐺', key: m.key } }).catch(()=>{})
      if (global.wolfDB.auto.antidelete) {
        global.wolfDB.deletedCache[m.key.id] = { message: m.message, key: m.key, time: Date.now() }
        // Clean old
        for (let id in global.wolfDB.deletedCache) {
          if (Date.now() - global.wolfDB.deletedCache[id].time > 3600000) delete global.wolfDB.deletedCache[id]
        }
      }
    } catch {}

    // ===== COMMAND PARSER =====
    const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || m.message.videoMessage?.caption || m.message.viewOnceMessage?.message?.imageMessage?.caption || m.message.viewOnceMessage?.message?.videoMessage?.caption || m.message.viewOnceMessageV2?.message?.imageMessage?.caption || m.message.viewOnceMessageV2?.message?.videoMessage?.caption || ""
    if (!body.startsWith(settings.prefix)) return

    const args = body.slice(settings.prefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase().replace(/[^a-z0-9]/g,'') || args[0]
    const rawCommand = body.slice(settings.prefix.length).trim().split(/ +/)[0].toLowerCase()
    const q = args.join(" ")

    const reply = async (text, opts={}) => {
      await sock.sendMessage(m.key.remoteJid, { text: text, ...opts }, { quoted: m })
    }

    const isOwner = m.key.fromMe || m.key.remoteJid.includes('239166265317') || (m.key.participant && m.key.participant.includes('239166265317')) || global.wolfDB.owners.includes(m.key.remoteJid) || global.wolfDB.owners.includes(m.key.participant)

    try {
      // CORE
      if (['menu','help','allcmd'].includes(rawCommand) || ['menu','help','allcmd'].includes(command)) {
        await sock.sendMessage(m.key.remoteJid, { image: { url: settings.pfpUrl }, caption: WOLF_MENU }, { quoted: m })
        return
      }
      if (['ping','speed'].includes(command) || ['ping','speed'].includes(rawCommand)) {
        const start = Date.now()
        await reply(`🐺 PINGING WOLF...`)
        const end = Date.now()
        await reply(`⚡ WOLF SPEED: ${end - start}ms\n🟢 ONLINE\n📦 ${Object.keys(pluginCommands).length} cmds\n🐺 ALPHA AND OMEGA`)
        return
      }
      if (command === 'alive' || rawCommand === 'alive') {
        await sock.sendMessage(m.key.remoteJid, {
          image: { url: settings.pfpUrl },
          caption: `🐺 *ALPHA AND OMEGA IS ALIVE!*\n\n⚡ Version: 2.5.0 PREMIUM\n📚 Commands: ${Object.keys(pluginCommands).length}+ Real\n👑 Owner: ${settings.ownerNumber}\n🏢 Simon Tech Inc\n🟢 Status: ONLINE\n📦 15 Plugins Connected\n\n*WOLF NEVER SLEEPS*`
        }, { quoted: m })
        return
      }
      if (command === 'owner' || rawCommand === 'owner') {
        await reply(`👑 OWNER\nName: Simon Tech Inc\nNumber: ${settings.ownerNumber}\nChannel: ${settings.channelLink}\n📦 ${Object.keys(pluginCommands).length} cmds active`)
        return
      }
      if (['runtime','uptime'].includes(command) || ['runtime','uptime'].includes(rawCommand)) {
        const up = process.uptime()
        const d = Math.floor(up / 86400), h = Math.floor((up % 86400) / 3600), mm = Math.floor((up % 3600) / 60), s = Math.floor(up % 60)
        await reply(`⏰ *RUNTIME*\n${d}d ${h}h ${mm}m ${s}s\n🐺 WOLF XMD - ${Object.keys(pluginCommands).length} cmds`)
        return
      }

      // PLUGIN CMDS - REAL HANDLERS
      const finalCmd = pluginCommands[rawCommand] ? rawCommand : command
      if (pluginCommands[finalCmd]) {
        if (global.wolfDB.mode === 'self' && !isOwner) return
        console.log(chalk.yellow(`[PLUGIN] ${finalCmd} - ${q.slice(0,30)}`))
        await pluginCommands[finalCmd](sock, m, { command: finalCmd, text: q, args, reply, isOwner, prefix: settings.prefix })
        return
      }

      // FALLBACK
      if (['ai','gpt','chatgpt','gemini','ask'].includes(command)) {
        if (!q) return reply(`🤖 Usage: .${command} <question>`)
        await reply(`🤖 *WOLF AI*\nQ: ${q}\n\nConnect API in settings.js or use .gpt from plugins for real AI!\n🐺`)
        return
      }

    } catch (e) {
      console.log(chalk.red(`WOLF Error ${command}:`), e.message)
    }
  })

  // ANTI DELETE
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

  console.log(chalk.green(`🐺 main.js READY - ${Object.keys(pluginCommands).length} CMDS - RENDER SAFE!`))
                         }
