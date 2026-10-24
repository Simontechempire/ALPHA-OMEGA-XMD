// 👑 ALPHA AND OMEGA WOLF XMD - FILE 13 OWNER - 50 CMDS - TYPE 2 DASHBOARD - ULTIMATE
const os = require('os')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)
const settings = require('../settings')
const pino = require('pino')

module.exports = {
  command: ['eval','exec','sh','term','restart','shutdown','update','gitpull','setprefix','setstatus','setbio','setname','setppbot','getppbot','blocklist','block','unblock','join','leave','creategroup','deletegroup','setowner','addowner','delowner','ownermode','self','public','mode','pmblocker','anticall','callblock','backup','restore','broadcast','bc','bcgc','bcall','cleartmp','tmpclean','logs','log','system','sysinfo','ping','speed','runtime','uptime','cpu','ram','disk','hostinfo','botinfo','version','changelog','reportbug'],

  execute: async (sock, m, { command, text, reply, isOwner, prefix }) => {
    // TYPE 2: Owner check from settings.js
    if (!isOwner && !['ping','speed','runtime','uptime','system','botinfo','version','reportbug'].includes(command)) {
      return reply(settings.mess.owner)
    }

    try {
      if (command === 'eval') {
        if (!text) return reply(`Usage: ${prefix}eval <js code> TYPE 2\nEx: ${prefix}eval reply(settings.botName)`)
        try {
          // TYPE 2: Provide useful globals
          const settings = require('../settings')
          let result = await eval(`(async()=>{ 
            const sock = global._sock || null
            ${text} 
          })()`)
          return reply(`💻 *EVAL RESULT TYPE 2*\n\nCode: ${text}\n\nResult: ${util.format(result).slice(0,3000)}\n\n🐺 TYPE 2 | Mode: ${settings.mode}`)
        } catch (e) { return reply(`❌ EVAL ERROR TYPE 2\n${e.message}\n${e.stack?.slice(0,1000)}`) }
      }

      if (['exec','sh','term'].includes(command)) {
        if (!text) return reply(`Usage: ${prefix}${command} <shell command> TYPE 2`)
        if (text.includes('rm -rf /') || text.includes('> /dev/sda')) return reply(`❌ Dangerous command blocked TYPE 2 🛡️`)
        try {
          const { stdout, stderr } = await execPromise(text, { timeout: 30000 })
          return reply(`💻 *SHELL TYPE 2*\n\nCmd: ${text}\n\nOutput:\n${(stdout || stderr).slice(0,3000) || 'No output'}\n\n🐺 MODE: ${settings.mode}`)
        } catch (e) { return reply(`❌ SHELL ERROR TYPE 2\n${e.message.slice(0,2000)}`) }
      }

      if (command === 'restart') {
        await reply(`🔄 Restarting ${settings.botName} TYPE 2...\nMode: ${settings.mode}\nRender will auto-restart in 5s 🐺`)
        setTimeout(()=> process.exit(1), 1000)
        return
      }
      if (command === 'shutdown') {
        await reply(`💤 Shutting down WOLF XMD TYPE 2... 🐺\nTo start again, restart in Render Dashboard`)
        process.exit(0)
      }

      if (command === 'update' || command === 'gitpull') {
        await reply(`📥 Updating WOLF XMD TYPE 2 from GitHub...\nRepo: https://github.com/...\n🐺`)
        try {
          const { stdout } = await execPromise('git pull 2>&1 || echo "No git repo - TYPE 2 uses Render auto-deploy from GitHub"')
          return reply(`✅ *UPDATE TYPE 2*\n\n${stdout.slice(0,2000)}\n\n💡 TYPE 2: Push to GitHub = Render auto-deploys!\nNo need git pull - Just git push 🐺`)
        } catch (e) { return reply(`❌ Update error TYPE 2: ${e.message}\nTip: In TYPE 2 just push to GitHub`) }
      }

      if (command === 'setprefix') {
        if (!text) return reply(`Usage: ${prefix}setprefix <new prefix>\nCurrent: ${settings.prefix} | ENV: ${process.env.PREFIX || settings.prefix}\n\nTo make permanent: Set PREFIX in Render Dashboard ENV 🐺 TYPE 2`)
        global.db = global.db || {}; global.db.settings = global.db.settings || {}
        global.db.settings.prefix = text
        return reply(`✅ Prefix set TYPE 2 to: ${text} (Runtime)\nEx: ${text}ping\nTo make permanent set PREFIX=${text} in Render ENV\n\n🐺 TYPE 2`)
      }

      if (command === 'setstatus' || command === 'setbio') {
        if (!text) return reply(`Usage: ${prefix}setbio <new bio> TYPE 2\nCurrent ENV: ${settings.auto.autoBioText}`)
        await sock.updateProfileStatus(text)
        if (global.db?.settings) global.db.settings.autobioText = text
        return reply(`✅ Bio/Status set TYPE 2 to: ${text}\n\nTo make permanent: Set AUTOBIO_TEXT in Render ENV 🐺`)
      }
      if (command === 'setname') {
        if (!text) return reply(`Usage: ${prefix}setname <new bot name> TYPE 2`)
        await sock.updateProfileName(text)
        return reply(`✅ Bot name set TYPE 2 to: ${text}\n\n🐺 Bot: ${settings.botName}`)
      }

      if (command === 'setppbot') {
        try {
          const { downloadMediaMessage } = require('@whiskeysockets/baileys')
          const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
          let buffer
          if (quoted?.imageMessage) {
            buffer = await downloadMediaMessage({ message: quoted }, 'buffer', {}, { logger: pino({level:'silent'}), reuploadRequest: sock.updateMediaMessage })
          } else if (m.message?.imageMessage) {
            buffer = await downloadMediaMessage(m, 'buffer', {}, { logger: pino({level:'silent'}), reuploadRequest: sock.updateMediaMessage })
          }
          if (!buffer) return reply(`Reply image with ${prefix}setppbot TYPE 2 - Real handler`)
          await sock.updateProfilePicture(sock.user.id, buffer)
          return reply(`🖼️ Bot PP updated TYPE 2! 🐺`)
        } catch (e) { return reply(`❌ setppbot TYPE 2 error: ${e.message}`) }
      }
      if (command === 'getppbot') {
        try {
          const pp = await sock.profilePictureUrl(sock.user.id, 'image')
          if (pp) await sock.sendMessage(m.key.remoteJid, { image: { url: pp }, caption: `🖼️ Bot PP TYPE 2\n\n🤖 ${settings.botName}\nMode: ${settings.mode}\n\n🐺` }, { quoted: m })
          else return reply(`No bot PP set TYPE 2`)
        } catch { return reply(`No bot PP or private TYPE 2`) }
        return
      }

      if (command === 'blocklist') {
        const blocks = await sock.fetchBlocklist().catch(()=>[])
        return reply(`🚫 *BLOCKLIST TYPE 2*\n\nTotal: ${blocks.length}\nMode: ${settings.mode}\n\n${blocks.map(b=>`@${b.split('@')[0]}`).join('\n') || 'Empty'}\n\n🐺`, { mentions: blocks })
      }
      if (command === 'block') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null)
        if (!user) return reply(`Tag user to block - ${prefix}block @user TYPE 2`)
        await sock.updateBlockStatus(user, 'block')
        return reply(`🚫 Blocked @${user.split('@')[0]} TYPE 2`, { mentions: [user] })
      }
      if (command === 'unblock') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null)
        if (!user) return reply(`Tag user to unblock`)
        await sock.updateBlockStatus(user, 'unblock')
        return reply(`✅ Unblocked @${user.split('@')[0]} TYPE 2`, { mentions: [user] })
      }

      if (command === 'join') {
        if (!text) return reply(`Usage: ${prefix}join <group invite link> TYPE 2`)
        const code = text.split('/').pop().split('?')[0]
        await sock.groupAcceptInvite(code)
        return reply(`✅ Joined group TYPE 2 with code ${code}\n\n🐺 ${settings.botName}`)
      }
      if (command === 'leave') {
        const target = text?.includes('@g.us') ? text : m.key.remoteJid
        await reply(`👋 Leaving TYPE 2 ${target}\n\n🐺`)
        await sock.groupLeave(target)
        return
      }
      if (command === 'creategroup') {
        if (!text) return reply(`Usage: ${prefix}creategroup GroupName|@user1 @user2 TYPE 2`)
        const parts = text.split('|')
        const name = parts[0].trim()
        const users = m.message.extendedTextMessage?.contextInfo?.mentionedJid || []
        const g = await sock.groupCreate(name, users)
        return reply(`✅ Group created TYPE 2: ${name}\nID: ${g.id}\nMode: ${settings.mode}\n\n🐺`)
      }

      if (['setowner','addowner','delowner','ownermode'].includes(command)) {
        global.db = global.db || { owners: settings.owners }
        if (command === 'addowner') {
          const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
          if (!user) return reply(`Tag user to add as owner - ${prefix}addowner @user TYPE 2`)
          global.db.owners = global.db.owners || [...settings.owners]
          if (!global.db.owners.includes(user)) global.db.owners.push(user)
          return reply(`✅ Added owner TYPE 2: @${user.split('@')[0]}\nTo make permanent add to OWNER_NUMBER in Render ENV`, { mentions: [user] })
        }
        if (command === 'delowner') {
          const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
          global.db.owners = (global.db.owners || settings.owners).filter(o=>o!==user && !user.includes(o))
          return reply(`✅ Removed owner TYPE 2: @${user.split('@')[0]}`, { mentions: [user] })
        }
        return reply(`👑 Owner mode TYPE 2\nCurrent ENV: ${settings.ownerNumber}\nRuntime owners: ${global.db.owners?.length || settings.owners.length}\nMode: ${settings.mode}\n\nTo add permanent owner: Set OWNER_NUMBER in Render Dashboard ENV (comma separated) 🐺 TYPE 2`)
      }

      if (['self','public','mode'].includes(command)) {
        global.db = global.db || {}; global.db.settings = global.db.settings || {}
        if (command === 'self') global.db.settings.mode = 'self'
        if (command === 'public') global.db.settings.mode = 'public'
        if (command === 'mode') {
          if (!text) {
            return reply(`*MODE TYPE 2*\n\nRuntime: ${global.db.settings.mode || settings.mode}\nENV: ${settings.mode}\n\nUsage: ${prefix}mode public/self\nTo make permanent: Set MODE in Render Dashboard ENV to public/self/private\n\n🐺 TYPE 2`)
          }
          if (!['public','self','private'].includes(text)) return reply(`❌ Mode must be public/self/private`)
          global.db.settings.mode = text
        }
        return reply(`🔧 Mode set TYPE 2 to: ${global.db.settings.mode || text}\n\n${(global.db.settings.mode || text)==='self' ? 'Bot only responds to owner' : 'Bot responds to everyone'} 🐺\nTo make permanent set MODE in Render ENV`)
      }

      if (['pmblocker','anticall','callblock'].includes(command)) {
        global.db = global.db || {}; global.db.settings = global.db.settings || {}
        if (!text) return reply(`Usage: ${prefix}${command} on/off\nRuntime: ${global.db.settings[command] ? 'ON' : 'OFF'}\nENV AntiCall: ${settings.auto.antiCall}\nSet ANTI_CALL=true in Dashboard for permanent 🐺 TYPE 2`)
        global.db.settings[command] = text === 'on'
        if (command === 'anticall' || command === 'callblock') global.db.settings.anticall = text === 'on'
        return reply(`✅ ${command} TYPE 2 ${text === 'on' ? 'ENABLED 🟢' : 'DISABLED 🔴'}\nTo make permanent set ANTI_CALL=${text} in Render ENV 🐺`)
      }

      if (command === 'backup') {
        await reply(`💾 Creating backup TYPE 2...`)
        try {
          const backupDir = './backups'
          if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir)
          // TYPE 2: Backup settings + creds info
          const info = `Backup ${new Date().toISOString()}\nBot: ${settings.botName}\nMode: ${settings.mode}\nOwner: ${settings.ownerNumber}\nSettings: ${JSON.stringify(settings.auto, null, 2)}`
          fs.writeFileSync(path.join(backupDir, `wolf-backup-${Date.now()}.txt`), info)
          return reply(`✅ Backup created TYPE 2!\nFolder: backups/\nBot: ${settings.botName}\nMode: ${settings.mode}\n\nIn TYPE 2 Render, creds are persistent - no need backup session 🐺`)
        } catch (e) { return reply(`❌ Backup error TYPE 2: ${e.message}`) }
      }
      if (command === 'restore') return reply(`💾 Restore TYPE 2: In Render TYPE 2, session is auto-persistent. Just restart service. No need restore 🐺\nIf you have backup file upload to session folder`)

      if (['broadcast','bc','bcgc','bcall'].includes(command)) {
        if (!text) return reply(`Usage: ${prefix}${command} <message> TYPE 2\nBroadcasts to all chats/groups`)
        const allGroups = await sock.groupFetchAllParticipating().catch(()=>({}))
        const groupIds = Object.keys(allGroups)
        let targets = []
        if (command === 'bcgc') targets = groupIds
        else if (command === 'bcall') {
          // All chats - for TYPE 2 we only have groups easily
          targets = groupIds.slice(0,20) // limit to avoid ban
        } else targets = [m.key.remoteJid]

        let count = 0
        for (let id of targets) {
          await sock.sendMessage(id, { text: `📢 *BROADCAST FROM OWNER TYPE 2*\n\n${text}\n\n🐺 ${settings.botName} | Mode: ${settings.mode}` }).catch(()=>{})
          count++
          await new Promise(r=> setTimeout(r, 1000)) // Avoid ban
        }
        return reply(`📢 Broadcast TYPE 2 sent to ${count} chats\n\nMessage: ${text.slice(0,100)}\nMode: ${settings.mode}\n\n🐺 TYPE 2 - Slow send to avoid ban`)
      }

      if (['cleartmp','tmpclean'].includes(command)) {
        try { 
          if (fs.existsSync('./tmp')) fs.rmSync('./tmp', {recursive:true, force:true})
          fs.mkdirSync('./tmp', {recursive:true})
        } catch {}
        return reply(`🧹 Tmp cleared TYPE 2! Free space cleaned\n\n🐺 ${settings.botName}`)
      }
      if (['logs','log'].includes(command)) {
        let logText = 'No logs file - TYPE 2 logs in Render Dashboard > Logs tab 🐺'
        try { if (fs.existsSync('./logs.txt')) logText = fs.readFileSync('./logs.txt','utf8').slice(-3000) } catch {}
        return reply(`📋 *LOGS TYPE 2*\n\n${logText}\n\n💡 In TYPE 2 check Render Dashboard > Logs for live logs\n\n🐺`)
      }

      if (['system','sysinfo','hostinfo','botinfo','cpu','ram','disk'].includes(command)) {
        const mem = os.totalmem()
        const free = os.freemem()
        const cpus = os.cpus()
        return reply(`💻 *SYSTEM INFO TYPE 2*\n\n🖥️ Host: ${os.hostname()}\nOS: ${os.type()} ${os.arch()}\nPlatform: ${os.platform()} | Render.com\nUptime: ${Math.floor(os.uptime()/3600)}h\nCPU: ${cpus[0].model} (${cpus.length} cores)\nRAM: ${(free/1024/1024/1024).toFixed(2)}GB free / ${(mem/1024/1024/1024).toFixed(2)}GB total\nLoad: ${os.loadavg().join(', ')}\nNode: ${process.version}\n\n🤖 Bot: ${settings.botName} TYPE 2\nVersion: ${settings.version}\nMode: ${settings.mode}\nOwner: ${settings.ownerNumber}\nPrefix: ${settings.prefix}\nAutoRead: ${settings.auto.autoRead} | AutoView: ${settings.auto.autoViewStatus}\nGemini: ${process.env.GEMINI_API_KEY ? 'SET ✓' : 'NOT SET ✗'}\n\n🐺 TYPE 2 RENDER`)
      }
      if (command === 'ping' || command === 'speed') {
        const start = Date.now()
        const msg = await sock.sendMessage(m.key.remoteJid, { text: `🏓 Pinging TYPE 2...` }, { quoted: m })
        const latency = Date.now() - start
        return sock.sendMessage(m.key.remoteJid, { text: `🏓 *PING TYPE 2*\n\nLatency: ${latency}ms\nSpeed: ${latency < 100 ? 'Ultra Fast ⚡🐺' : latency < 300 ? 'Fast 🚀' : 'Slow 🐢'}\nBot: ${settings.botName}\nMode: ${settings.mode}\n\n🐺 WOLF XMD TYPE 2`, edit: msg.key })
      }
      if (command === 'runtime' || command === 'uptime') {
        const up = process.uptime()
        const h = Math.floor(up/3600), mm = Math.floor((up%3600)/60), s = Math.floor(up%60)
        return reply(`⏰ *UPTIME TYPE 2*\n\n${h}h ${mm}m ${s}s\n\nStarted: ${new Date(Date.now()-up*1000).toLocaleString('en-US',{timeZone:'Africa/Lagos'})}\nBot: ${settings.botName}\nMode: ${settings.mode}\nRender: Persistent\n\n🐺 ALPHA AND OMEGA TYPE 2`)
      }
      if (command === 'version' || command === 'changelog') {
        return reply(`🤖 *WOLF XMD VERSION TYPE 2*\n\nName: ${settings.botName}\nVersion: ${settings.version} ALPHA AND OMEGA TYPE 2\nCode: 1000+ cmds\nFiles: 13+ plugins TYPE 2\nOwner: ${settings.ownerNumber}\nMode: ${settings.mode}\nPrefix: ${settings.prefix}\nUpdate: 24 Oct 2026 TYPE 2\n\nChangelog TYPE 2:\n- Render Dashboard ENV controlled\n- 100% persistent session\n- Gemini AI with API key ENV\n- Auto functions ENV controlled\n- AntiNSFW family safe\n- Economy system\n- Logo maker real APIs\n- Ping with edit\n\nENV Check:\nGEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'OK ✓' : 'MISSING ✗'}\nMODE: ${settings.mode}\nAUTO_VIEW: ${settings.auto.autoViewStatus}\n\n🐺 TYPE 2`)
      }
      if (command === 'reportbug') {
        if (!text) return reply(`Usage: ${prefix}reportbug <bug description> TYPE 2`)
        // Send to owner
        try {
          await sock.sendMessage(settings.ownerNumber + '@s.whatsapp.net', { text: `🐛 *BUG REPORT TYPE 2*\n\nFrom: ${m.key.remoteJid}\nSender: ${m.pushName}\n\nBug: ${text}\n\nBot: ${settings.botName} v${settings.version}` })
        } catch {}
        return reply(`🐛 Bug reported TYPE 2: ${text}\n\nReported to owner ${settings.ownerNumber}! Thanks! 🐺`)
      }

    } catch (e) {
      console.log(`Owner TYPE 2 Error ${command}: ${e.message}`, e.stack)
      reply(`❌ Owner TYPE 2 Error: ${e.message}\nBot: ${settings.botName} 🐺`)
    }
  }
}
