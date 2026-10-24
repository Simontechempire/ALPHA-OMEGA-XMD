// 🛡️ ALPHA AND OMEGA WOLF XMD - FILE 6 PROTECTION - 50 CMDS - TYPE 2 DASHBOARD
const settings = require('../settings')

module.exports = {
  command: ['antilink','antispam','antibot','antitag','antiflood','warn','warnings','resetwarn','clearwarn','ban','unban','block','unblock','delete','del','purge','clear','slowmode','lock','unlock','antibadword','badword','addbadword','delbadword','listbadword','antimention','antifake','antiscam','antiphish','antivirtex','antiforward','antimedia','antisticker','antigif','antidocument','antiaudio','antivideo','antipicture','antipoll','antichannel','antigroup','antipromote','antidemote','raidmode','security','modlogs','setwarn','resetprotection','gstatus','protection'],

  execute: async (sock, m, { command, text, reply, isOwner, prefix }) => {
    global.db = global.db || {}
    global.db.protection = global.db.protection || {}
    global.db.warnings = global.db.warnings || {}
    global.db.badword = global.db.badword || {}
    global.db.modlogs = global.db.modlogs || {}
    global.db.ban = global.db.ban || {}
    global.db.groups = global.db.groups || {}

    const chat = m.key.remoteJid
    const isGroup = chat.endsWith('@g.us')

    // TYPE 2: Default from ENV settings
    if (!global.db.protection[chat]) {
      global.db.protection[chat] = { 
        antilink: settings.auto.antiLink, 
        antispam: settings.auto.antiSpam, 
        antibot: false, 
        antitag: false, 
        antiflood: false, 
        antibadword: false, 
        antimention: false, 
        antifake: false, 
        antiscam: false, 
        antiphish: false, 
        antivirtex: false, 
        antiforward: false, 
        antimedia: false, 
        antisticker: false, 
        antigif: false, 
        antidocument: false, 
        antiaudio: false, 
        antivideo: false, 
        antipicture: false, 
        antipoll: false, 
        antichannel: false, 
        antigroup: false, 
        antipromote: false, 
        antidemote: false, 
        raidmode: false, 
        slowmode: 0, 
        lock: false,
        maxWarn: 3
      }
    }
    // Sync with global.db.groups for antiLink handler in connection.js
    global.db.groups[chat] = global.db.groups[chat] || {}
    if (typeof global.db.groups[chat].antilink === 'undefined') global.db.groups[chat].antilink = global.db.protection[chat].antilink
    if (typeof global.db.groups[chat].antispam === 'undefined') global.db.groups[chat].antispam = global.db.protection[chat].antispam

    const getGroupMeta = async () => {
      if (!isGroup) return { participants: [] }
      try { return await sock.groupMetadata(chat) } catch { return { participants: [] } }
    }

    const isAdmin = async () => {
      if (!isGroup) return true
      const meta = await getGroupMeta()
      const senderId = m.key.participant || m.key.remoteJid
      const isSenderAdmin = meta.participants.find(p=> p.id === senderId || p.id.includes(senderId.split('@')[0]))?.admin
      return isSenderAdmin || isOwner
    }

    try {
      const toggleProtections = ['antilink','antispam','antibot','antitag','antiflood','antibadword','antimention','antifake','antiscam','antiphish','antivirtex','antiforward','antimedia','antisticker','antigif','antidocument','antiaudio','antivideo','antipicture','antipoll','antichannel','antigroup','antipromote','antidemote','raidmode']
      
      if (toggleProtections.includes(command)) {
        if (!await isAdmin()) return reply(`❌ Admin only! 🐺 TYPE 2`)
        if (!text) {
          const envKey = command.toUpperCase()
          const envVal = command === 'antilink' ? settings.auto.antiLink : command === 'antispam' ? settings.auto.antiSpam : 'N/A'
          return reply(`🛡️ *${command.toUpperCase()} TYPE 2*\n\nRuntime: ${global.db.protection[chat][command] ? 'ON 🟢' : 'OFF 🔴'}\nENV: ${envVal}\nUsage: ${prefix}${command} on/off\n\nTo make permanent set ${envKey}=true in Render Dashboard ENV\n\n🐺 WOLF PROTECTION TYPE 2`)
        }
        if (text !== 'on' && text !== 'off') return reply(`Use on/off - ${prefix}${command} on/off`)
        global.db.protection[chat][command] = text === 'on'
        // Sync to groups DB for connection.js handler
        if (['antilink','antispam'].includes(command)) global.db.groups[chat][command] = text === 'on'
        global.db.modlogs[chat] = global.db.modlogs[chat] || []
        global.db.modlogs[chat].push(`${new Date().toLocaleString('en-US',{timeZone:'Africa/Lagos'})} - ${command} ${text} by ${m.pushName || m.key.participant}`)
        if (global.db.modlogs[chat].length > 50) global.db.modlogs[chat] = global.db.modlogs[chat].slice(-50)
        return reply(`🛡️ *${command.toUpperCase()}* ${text === 'on' ? 'ENABLED 🟢 TYPE 2' : 'DISABLED 🔴'}\n\nProtection active!\nENV: Set ${command.toUpperCase()}=${text} in Dashboard for permanent\n\n🐺 ALPHA AND OMEGA TYPE 2`)
      }

      if (command === 'protection') {
        const p = global.db.protection[chat]
        let txt = `🛡️ *PROTECTION DASHBOARD TYPE 2*\n\nGroup: ${isGroup ? chat : 'Private'}\nENV Defaults:\nANTI_LINK=${settings.auto.antiLink}\nANTI_SPAM=${settings.auto.antiSpam}\n\nRuntime:\n`
        Object.entries(p).forEach(([k,v])=> txt += `${v ? '🟢' : '🔴'} ${k}: ${v ? 'ON' : 'OFF'}\n`)
        txt += `\nUse ${prefix}security to view\n🐺 TYPE 2`
        return reply(txt)
      }

      if (command === 'warn') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Usage: ${prefix}warn @user <reason> TYPE 2`)
        const reason = text.split(' ').slice(1).join(' ') || 'No reason'
        global.db.warnings[user] = global.db.warnings[user] || {}
        global.db.warnings[user][chat] = (global.db.warnings[user][chat] || 0) + 1
        const count = global.db.warnings[user][chat]
        const maxWarn = global.db.protection[chat].maxWarn || 3
        await sock.sendMessage(chat, { text: `⚠️ *WARNED TYPE 2*\n\nUser: @${user.split('@')[0]}\nReason: ${reason}\nTotal Warnings: ${count}/${maxWarn}\n\n${count >= maxWarn ? '🚫 Will be kicked!' : ''}`, mentions: [user] }, { quoted: m })
        if (count >= maxWarn && isGroup) {
          try {
            const meta = await getGroupMeta()
            const botAdmin = meta.participants.some(p=> p.id.includes(sock.user.id.split('@')[0]) && p.admin)
            if (botAdmin) {
              await sock.groupParticipantsUpdate(chat, [user], 'remove')
              global.db.warnings[user][chat] = 0
              await sock.sendMessage(chat, { text: `🚫 User @${user.split('@')[0]} reached ${maxWarn} warns and kicked! TYPE 2`, mentions: [user] })
            }
          } catch {}
        }
        return
      }

      if (command === 'warnings') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || m.key.participant || m.key.remoteJid
        const count = global.db.warnings[user]?.[chat] || global.db.warnings[user] || 0
        const actualCount = typeof count === 'object' ? (count[chat] || 0) : count
        return reply(`⚠️ *WARNINGS TYPE 2*\n\nUser: @${user.split('@')[0]}\nWarnings: ${actualCount}/${global.db.protection[chat].maxWarn || 3}\nGroup: ${chat}\n\n🐺 TYPE 2`, { mentions: [user] })
      }

      if (command === 'resetwarn' || command === 'clearwarn') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Tag user to clear warns - ${prefix}clearwarn @user`)
        if (global.db.warnings[user]) {
          if (typeof global.db.warnings[user] === 'object') global.db.warnings[user][chat] = 0
          else global.db.warnings[user] = 0
        }
        return reply(`✅ Warnings cleared TYPE 2 for @${user.split('@')[0]}`, { mentions: [user] })
      }

      if (command === 'ban') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Tag user to ban - ${prefix}ban @user`)
        global.db.ban[user] = true
        if (isGroup) {
          try {
            const meta = await getGroupMeta()
            const botAdmin = meta.participants.some(p=> p.id.includes(sock.user.id.split('@')[0]) && p.admin)
            if (botAdmin) await sock.groupParticipantsUpdate(chat, [user], 'remove')
          } catch {}
        }
        return reply(`🚫 Banned TYPE 2 @${user.split('@')[0]}`, { mentions: [user] })
      }
      if (command === 'unban') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null)
        if (!user) return reply(`Tag user`)
        delete global.db.ban[user]
        return reply(`✅ Unbanned TYPE 2 @${user.split('@')[0]}`, { mentions: [user] })
      }

      if (command === 'block') {
        if (!isOwner) return reply(settings.mess.owner)
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null)
        if (!user) return reply(`Tag user`)
        await sock.updateBlockStatus(user, 'block')
        return reply(`✅ Blocked TYPE 2 ${user}`)
      }
      if (command === 'unblock') {
        if (!isOwner) return reply(settings.mess.owner)
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null)
        if (!user) return reply(`Tag user`)
        await sock.updateBlockStatus(user, 'unblock')
        return reply(`✅ Unblocked TYPE 2 ${user}`)
      }

      if (command === 'delete' || command === 'del') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        const q = m.message.extendedTextMessage?.contextInfo
        if (!q?.stanzaId) return reply(`Reply message to delete - ${prefix}del TYPE 2`)
        try {
          await sock.sendMessage(chat, { delete: { remoteJid: chat, fromMe: q.fromMe || false, id: q.stanzaId, participant: q.participant } })
          return reply(`🗑️ Deleted TYPE 2!`)
        } catch (e) { return reply(`❌ Delete failed TYPE 2: ${e.message}\nBot needs admin`) }
      }

      if (command === 'purge' || command === 'clear') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        const num = parseInt(text) || 10
        return reply(`🧹 Purge TYPE 2 requested - ${num} messages\n\nIn TYPE 2: Use ${prefix}del reply to delete one by one (Baileys needs message keys)\nOr enable auto-clean in Dashboard 🐺`)
      }

      if (command === 'slowmode') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        if (!text) return reply(`Usage: ${prefix}slowmode <seconds> / off\nCurrent: ${global.db.protection[chat].slowmode || 'OFF'} TYPE 2`)
        if (text === 'off') { global.db.protection[chat].slowmode = 0; return reply(`✅ Slowmode OFF TYPE 2`) }
        const sec = parseInt(text)
        if (isNaN(sec)) return reply(`Give number`)
        global.db.protection[chat].slowmode = sec
        return reply(`🐢 Slowmode TYPE 2 set to ${sec}s`)
      }

      if (command === 'lock' || command === 'unlock') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        global.db.protection[chat].lock = command === 'lock'
        try {
          if (command === 'lock') await sock.groupSettingUpdate(chat, 'announcement')
          else await sock.groupSettingUpdate(chat, 'not_announcement')
          return reply(`${command === 'lock' ? '🔒 Group locked TYPE 2' : '🔓 Group unlocked TYPE 2'}`)
        } catch { return reply(`❌ Bot needs admin`) }
      }

      if (command === 'badword' || command === 'addbadword' || command === 'delbadword' || command === 'listbadword') {
        global.db.badword[chat] = global.db.badword[chat] || []
        if (command === 'addbadword') {
          if (!await isAdmin()) return reply(`❌ Admin only`)
          if (!text) return reply(`Usage: ${prefix}addbadword <word> TYPE 2`)
          global.db.badword[chat].push(text.toLowerCase())
          return reply(`✅ Added badword TYPE 2: ${text}\nTotal: ${global.db.badword[chat].length}\nEnable: ${prefix}antibadword on`)
        }
        if (command === 'delbadword') {
          if (!await isAdmin()) return reply(`❌ Admin only`)
          if (!text) return reply(`Usage: ${prefix}delbadword <word>`)
          global.db.badword[chat] = global.db.badword[chat].filter(w=>w!==text.toLowerCase())
          return reply(`✅ Removed badword TYPE 2: ${text}`)
        }
        if (command === 'listbadword' || command === 'badword') {
          return reply(`📜 *BADWORD LIST TYPE 2*\n\n${global.db.badword[chat].join(', ') || 'None'}\n\nTotal: ${global.db.badword[chat].length}\nProtection: ${global.db.protection[chat].antibadword ? 'ON' : 'OFF'}\n\n🐺 TYPE 2`)
        }
      }

      if (command === 'security') {
        const p = global.db.protection[chat]
        let txt = `🛡️ *SECURITY STATUS TYPE 2*\nGroup: ${chat}\nMode: ${settings.mode}\nBot: ${settings.botName}\n\n*ENV Defaults:*\nANTI_LINK: ${settings.auto.antiLink ? 'ON 🟢' : 'OFF 🔴'}\nANTI_SPAM: ${settings.auto.antiSpam ? 'ON' : 'OFF'}\nWELCOME: ${settings.auto.welcome ? 'ON' : 'OFF'}\n\n*Runtime:*\n`
        Object.entries(p).forEach(([k,v])=> txt += `${v ? '🟢' : '🔴'} ${k}: ${v ? 'ON' : 'OFF'}\n`)
        txt += `\nBadwords: ${global.db.badword[chat]?.length || 0}\nModLogs: ${global.db.modlogs[chat]?.length || 0}\n\nUse ${prefix}antilink on/off etc\n\n🐺 WOLF PROTECTION TYPE 2`
        return reply(txt)
      }

      if (command === 'modlogs') {
        const logs = global.db.modlogs[chat] || []
        return reply(`📋 *MOD LOGS TYPE 2*\n\n${logs.slice(-20).join('\n') || 'No logs yet'}\n\nBot: ${settings.botName}\n\n🐺 TYPE 2`)
      }

      if (command === 'setwarn') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        if (!text) return reply(`Usage: ${prefix}setwarn <number> - Set max warnings before kick\nCurrent: ${global.db.protection[chat].maxWarn || 3} TYPE 2`)
        const num = parseInt(text)
        if (isNaN(num)) return reply(`Give number`)
        global.db.protection[chat].maxWarn = num
        return reply(`✅ Max warnings TYPE 2 set to ${num}`)
      }

      if (command === 'resetprotection') {
        if (!await isAdmin()) return reply(`❌ Admin only`)
        if (!text.includes('CONFIRM')) return reply(`⚠️ Type ${prefix}resetprotection CONFIRM to reset all TYPE 2`)
        global.db.protection[chat] = { antilink: settings.auto.antiLink, antispam: settings.auto.antiSpam, antibot: false, antitag: false, antiflood: false, antibadword: false, maxWarn: 3, slowmode: 0, lock: false }
        global.db.groups[chat] = { antilink: settings.auto.antiLink, antispam: settings.auto.antiSpam }
        return reply(`🔄 All protections reset TYPE 2 to ENV defaults\n\n🐺 TYPE 2`)
      }

      if (command === 'gstatus') {
        return reply(`🛡️ Group Status Protection TYPE 2: ${global.db.protection[chat].antigroup ? 'ON 🟢' : 'OFF 🔴'}\nENV: ${settings.auto.antiLink ? 'ON' : 'OFF'}\nBot: ${settings.botName}\n\nUse ${prefix}antigroup on/off 🐺`)
      }

    } catch (e) {
      console.log(`Protection TYPE 2 Error ${command}: ${e.message}`)
      reply(`❌ Protection TYPE 2 Error: ${e.message} 🐺`)
    }
  }
      }
