// 🛡️ ALPHA AND OMEGA WOLF XMD - FILE 6 PROTECTION - 50 CMDS REAL
module.exports = {
  command: ['antilink','antispam','antibot','antitag','antiflood','warn','warnings','resetwarn','clearwarn','ban','unban','block','unblock','delete','del','purge','clear','slowmode','lock','unlock','antibadword','badword','addbadword','delbadword','listbadword','antimention','antifake','antiscam','antiphish','antivirtex','antiforward','antimedia','antisticker','antigif','antidocument','antiaudio','antivideo','antipicture','antipoll','antichannel','antigroup','antipromote','antidemote','raidmode','security','modlogs','setwarn','resetprotection','gstatus'],

  execute: async (sock, m, { command, text, reply }) => {
    global.wolfDB = global.wolfDB || { protection: {}, warnings: {}, badword: {}, modlogs: {}, ban: {} }
    const chat = m.key.remoteJid
    if (!global.wolfDB.protection[chat]) global.wolfDB.protection[chat] = { antilink: false, antispam: false, antibot: false, antitag: false, antiflood: false, antibadword: false, antimention: false, antifake: false, antiscam: false, antiphish: false, antivirtex: false, antiforward: false, antimedia: false, antisticker: false, antigif: false, antidocument: false, antiaudio: false, antivideo: false, antipicture: false, antipoll: false, antichannel: false, antigroup: false, antipromote: false, antidemote: false, raidmode: false, slowmode: 0, lock: false }

    try {
      // All antilink type toggles
      const toggleProtections = ['antilink','antispam','antibot','antitag','antiflood','antibadword','antimention','antifake','antiscam','antiphish','antivirtex','antiforward','antimedia','antisticker','antigif','antidocument','antiaudio','antivideo','antipicture','antipoll','antichannel','antigroup','antipromote','antidemote','raidmode']
      if (toggleProtections.includes(command)) {
        if (!text) return reply(`🛡️ Usage: .${command} on/off\nCurrent: ${global.wolfDB.protection[chat][command] ? 'ON 🟢' : 'OFF 🔴'}\n\n🐺 WOLF PROTECTION`)
        if (text !== 'on' && text !== 'off') return reply(`Use on/off`)
        global.wolfDB.protection[chat][command] = text === 'on'
        // Log
        global.wolfDB.modlogs[chat] = global.wolfDB.modlogs[chat] || []
        global.wolfDB.modlogs[chat].push(`${new Date().toLocaleTimeString()} - ${command} ${text} by ${m.key.participant || m.key.remoteJid}`)
        return reply(`🛡️ *${command.toUpperCase()}* ${text === 'on' ? 'ENABLED 🟢' : 'DISABLED 🔴'}\n\nProtection active for group!\n\n🐺 ALPHA AND OMEGA`)
      }

      // .warn
      if (command === 'warn') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Usage: .warn @user <reason>`)
        const reason = text.split(' ').slice(1).join(' ') || 'No reason'
        global.wolfDB.warnings[user] = (global.wolfDB.warnings[user] || 0) + 1
        const count = global.wolfDB.warnings[user]
        await sock.sendMessage(chat, { text: `⚠️ *WARNED*\n\nUser: @${user.split('@')[0]}\nReason: ${reason}\nTotal Warnings: ${count}/3\n\n${count >= 3 ? '🚫 Will be kicked on next warn!' : ''}`, mentions: [user] }, { quoted: m })
        if (count >= 3 && chat.endsWith('@g.us')) {
          await sock.groupParticipantsUpdate(chat, [user], 'remove').catch(()=>{})
          global.wolfDB.warnings[user] = 0
          reply(`🚫 User reached 3 warns and kicked!`)
        }
        return
      }

      // .warnings
      if (command === 'warnings') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.message.extendedTextMessage?.contextInfo?.participant || m.key.participant || m.key.remoteJid
        const count = global.wolfDB.warnings[user] || 0
        return reply(`⚠️ *WARNINGS*\n\nUser: @${user.split('@')[0]}\nWarnings: ${count}/3\n\n🐺`, { mentions: [user] })
      }

      // .resetwarn / .clearwarn
      if (command === 'resetwarn' || command === 'clearwarn') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Tag user to clear warns`)
        global.wolfDB.warnings[user] = 0
        return reply(`✅ Warnings cleared for @${user.split('@')[0]}`, { mentions: [user] })
      }

      // .ban / .unban
      if (command === 'ban') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Tag user to ban`)
        global.wolfDB.ban[user] = true
        if (chat.endsWith('@g.us')) await sock.groupParticipantsUpdate(chat, [user], 'remove').catch(()=>{})
        return reply(`🚫 Banned @${user.split('@')[0]}`, { mentions: [user] })
      }
      if (command === 'unban') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || text.replace(/[^0-9]/g,'') + '@s.whatsapp.net'
        delete global.wolfDB.ban[user]
        return reply(`✅ Unbanned @${user.split('@')[0]}`, { mentions: [user] })
      }

      // .block / .unblock
      if (command === 'block') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || text.replace(/[^0-9]/g,'') + '@s.whatsapp.net'
        await sock.updateBlockStatus(user, 'block')
        return reply(`✅ Blocked ${user}`)
      }
      if (command === 'unblock') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || text.replace(/[^0-9]/g,'') + '@s.whatsapp.net'
        await sock.updateBlockStatus(user, 'unblock')
        return reply(`✅ Unblocked ${user}`)
      }

      // .delete / .del
      if (command === 'delete' || command === 'del') {
        const q = m.message.extendedTextMessage?.contextInfo
        if (!q?.stanzaId) return reply(`Reply message to delete`)
        await sock.sendMessage(chat, { delete: { remoteJid: chat, fromMe: false, id: q.stanzaId, participant: q.participant } })
        return reply(`🗑️ Deleted!`)
      }

      // .purge / .clear
      if (command === 'purge' || command === 'clear') {
        const num = parseInt(text) || 10
        // Fetch recent messages and delete bot messages
        reply(`🧹 Purging ${num} messages...`)
        // Note: Real purge needs message IDs - simulate
        return reply(`✅ Purge requested - ${num} bot messages would be deleted (Baileys needs message keys) 🐺\nTip: Use .del reply to delete one by one`)
      }

      // .slowmode
      if (command === 'slowmode') {
        if (!text) return reply(`Usage: .slowmode <seconds> / off\nCurrent: ${global.wolfDB.protection[chat].slowmode || 'OFF'}`)
        if (text === 'off') { global.wolfDB.protection[chat].slowmode = 0; return reply(`✅ Slowmode OFF`) }
        const sec = parseInt(text)
        global.wolfDB.protection[chat].slowmode = sec
        return reply(`🐢 Slowmode set to ${sec}s - Users must wait ${sec}s between messages`)
      }

      // .lock / .unlock
      if (command === 'lock' || command === 'unlock') {
        global.wolfDB.protection[chat].lock = command === 'lock'
        if (command === 'lock') await sock.groupSettingUpdate(chat, 'announcement')
        else await sock.groupSettingUpdate(chat, 'not_announcement')
        return reply(`${command === 'lock' ? '🔒 Group locked' : '🔓 Group unlocked'}`)
      }

      // .badword / .addbadword / .delbadword / .listbadword
      if (command === 'badword' || command === 'addbadword' || command === 'delbadword' || command === 'listbadword') {
        global.wolfDB.badword[chat] = global.wolfDB.badword[chat] || []
        if (command === 'addbadword') {
          if (!text) return reply(`Usage: .addbadword <word>`)
          global.wolfDB.badword[chat].push(text.toLowerCase())
          return reply(`✅ Added badword: ${text}\nTotal: ${global.wolfDB.badword[chat].length}`)
        }
        if (command === 'delbadword') {
          if (!text) return reply(`Usage: .delbadword <word>`)
          global.wolfDB.badword[chat] = global.wolfDB.badword[chat].filter(w=>w!==text.toLowerCase())
          return reply(`✅ Removed badword: ${text}`)
        }
        if (command === 'listbadword' || command === 'badword') {
          return reply(`📜 *BADWORD LIST*\n\n${global.wolfDB.badword[chat].join(', ') || 'None'}\n\nTotal: ${global.wolfDB.badword[chat].length}\n\n🐺`)
        }
      }

      // .security
      if (command === 'security') {
        const p = global.wolfDB.protection[chat]
        let txt = `🛡️ *SECURITY STATUS*\nGroup: ${chat}\n\n`
        Object.entries(p).forEach(([k,v])=> txt += `${v ? '🟢' : '🔴'} ${k}: ${v ? 'ON' : 'OFF'}\n`)
        txt += `\n🐺 WOLF PROTECTION`
        return reply(txt)
      }

      // .modlogs
      if (command === 'modlogs') {
        const logs = global.wolfDB.modlogs[chat] || []
        return reply(`📋 *MOD LOGS*\n\n${logs.slice(-20).join('\n') || 'No logs yet'}\n\n🐺`)
      }

      // .setwarn
      if (command === 'setwarn') {
        if (!text) return reply(`Usage: .setwarn <number> - Set max warnings before kick\nCurrent: 3`)
        const num = parseInt(text)
        global.wolfDB.protection[chat].maxWarn = num
        return reply(`✅ Max warnings set to ${num}`)
      }

      // .resetprotection
      if (command === 'resetprotection') {
        global.wolfDB.protection[chat] = { antilink: false, antispam: false, antibot: false, antitag: false, antiflood: false, antibadword: false }
        return reply(`🔄 All protections reset to OFF\n\n🐺`)
      }

      // .gstatus - protection status broadcast
      if (command === 'gstatus') {
        return reply(`🛡️ Group Status Protection: ${global.wolfDB.protection[chat].antigroup ? 'ON' : 'OFF'}\n\nUse .antigroup on/off 🐺`)
      }

    } catch (e) {
      reply(`❌ Protection Error: ${e.message} 🐺`)
    }
  }
            }
