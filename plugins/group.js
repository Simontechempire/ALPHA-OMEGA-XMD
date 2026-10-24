// 👥 ALPHA AND OMEGA WOLF XMD - FILE 5 GROUP - 50 CMDS - TYPE 2 DASHBOARD
const settings = require('../settings')

module.exports = {
  command: ['kick','add','promote','demote','tagall','hidetag','admins','groupinfo','mute','unmute','open','close','revoke','newlink','resetlink','invite','join','leave','setname','setdesc','setsubject','setgrouppic','getgrouppic','groupname','groupdesc','membercount','members','listonline','listadmin','listmember','everyone','tagadmin','tagmember','kickall','promoteall','demoteall','group','antidelete','welcome','goodbye','setwelcome','setgoodbye','delwelcome','delgoodbye','approve','reject','requests','poll','vote','gstatus','gcstatus'],

  execute: async (sock, m, { command, text, reply, isOwner, prefix }) => {
    const isGroup = m.key.remoteJid.endsWith('@g.us')
    if (!isGroup) return reply(`👥 This command is for groups only! 🐺 TYPE 2`)

    let metadata
    try { metadata = await sock.groupMetadata(m.key.remoteJid) } catch { metadata = { participants: [], subject: 'Unknown', desc: '', owner: '', id: m.key.remoteJid, creation: Date.now()/1000 } }
    const participants = metadata.participants || []
    
    const getAdminStatus = (jid) => participants.find(p => p.id === jid || p.id.includes(jid.split('@')[0]))?.admin
    const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net'
    const botIdShort = sock.user.id.split('@')[0]
    const botAdmin = participants.some(p => (p.id === botJid || p.id.includes(botIdShort)) && p.admin)
    const senderId = m.key.participant || m.key.remoteJid
    const senderAdmin = getAdminStatus(senderId) || isOwner

    // TYPE 2: Use global.db.groups from connection.js
    global.db = global.db || {}
    global.db.groups = global.db.groups || {}
    global.db.groups[m.key.remoteJid] = global.db.groups[m.key.remoteJid] || { 
      antilink: settings.auto.antiLink, 
      antispam: settings.auto.antiSpam, 
      welcome: settings.auto.welcome, 
      welcomeText: `Welcome @user to ${metadata.subject} 🎉\n🐺 WOLF XMD TYPE 2`, 
      goodbyeText: `Goodbye @user 👋`,
      antidelete: settings.auto.antidelete
    }
    const groupDB = global.db.groups[m.key.remoteJid]

    try {
      if (command === 'gcstatus') {
        const txt = `╭━━━〔 🏰 GROUP STATUS TYPE 2 〕━━━╮
┃
┃ 👥 *Group:* ${metadata.subject}
┃ 🆔 *ID:* ${m.key.remoteJid}
┃ 👤 *Members:* ${participants.length}
┃ 👑 *Admins:* ${participants.filter(p=>p.admin).length}
┃ 🤖 *Bot Admin:* ${botAdmin ? 'YES ✓' : 'NO ✗'}
┃ 🔗 *Mode:* ${settings.mode}
┃ 🛡️ *AntiLink:* ${groupDB.antilink ? 'ON' : 'OFF'} | ENV: ${settings.auto.antiLink ? 'ON' : 'OFF'}
┃ 👋 *Welcome:* ${groupDB.welcome ? 'ON' : 'OFF'} | ENV: ${settings.auto.welcome ? 'ON' : 'OFF'}
┃ 🗑️ *AntiDelete:* ${groupDB.antidelete ? 'ON' : 'OFF'}
┃
╰━━━━━━━━━━━━━━━━━━━━╯\n\n🐺 TYPE 2 - ${settings.botName}`
        await sock.sendMessage(m.key.remoteJid, { text: txt }, { quoted: m })
        return
      }

      // Admin-only commands
      const adminCmds = ['kick','add','promote','demote','mute','unmute','open','close','revoke','newlink','resetlink','invite','setname','setdesc','setsubject','setgrouppic','kickall','promoteall','demoteall','group','setwelcome','setgoodbye','delwelcome','delgoodbye','approve','reject']
      if (adminCmds.includes(command) && !senderAdmin) return reply(`❌ Admin only! You need to be admin or owner 🐺 TYPE 2`)

      if (command === 'kick') {
        const mentioned = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        const target = mentioned || (text ? text.replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null)
        if (!target) return reply(`Usage: ${prefix}kick @user`)
        if (!botAdmin) return reply(`❌ Bot not admin - Make bot admin first 🐺`)
        if (getAdminStatus(target)) return reply(`❌ Cannot kick admin`)
        await sock.groupParticipantsUpdate(m.key.remoteJid, [target], 'remove')
        return reply(`✅ Kicked @${target.split('@')[0]} 🐺 TYPE 2`, { mentions: [target] })
      }

      if (command === 'add') {
        if (!text) return reply(`Usage: ${prefix}add 234xxx | ${prefix}add 239166265317`)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        const user = text.replace(/[^0-9]/g,'') + '@s.whatsapp.net'
        await sock.groupParticipantsUpdate(m.key.remoteJid, [user], 'add')
        return reply(`✅ Added ${text} 🐺 TYPE 2`)
      }

      if (command === 'promote') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Tag user to promote - ${prefix}promote @user`)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupParticipantsUpdate(m.key.remoteJid, [user], 'promote')
        return reply(`✅ Promoted @${user.split('@')[0]} to admin 🐺 TYPE 2`, { mentions: [user] })
      }

      if (command === 'demote') {
        const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!user) return reply(`Tag user to demote`)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupParticipantsUpdate(m.key.remoteJid, [user], 'demote')
        return reply(`✅ Demoted @${user.split('@')[0]} 🐺`, { mentions: [user] })
      }

      if (command === 'tagall' || command === 'everyone') {
        if (!senderAdmin && settings.mode !== 'public') return reply(`❌ Admin only in ${settings.mode} mode`)
        let txt = `╭━━━〔 📢 TAG ALL TYPE 2 〕━━━╮\n`
        txt += `┃ 🏷️ Group: ${metadata.subject || 'GROUP'}\n`
        txt += `┃ 👥 Members: ${participants.length}\n`
        txt += `┃ 🤖 Bot: ${settings.botName}\n`
        txt += `╰━━━━━━━━━━━━━━━━━━╯\n\n`
        if (text) txt += `💬 Message: ${text}\n\n`
        txt += `📣 *ATTENTION EVERYONE TYPE 2!*\n━━━━━━━━━━━━━━━━━━\n\n`
        const emojis = ['👑','🐺','🔥','⚡','🌟','💎','🚀','🎯','🦁','👻','💫','🌈','🎭','🛡️','❤️','🦋','🍀','🌍','🎉','🔱']
        let line = ''
        participants.forEach((p, i) => {
          const emoji = emojis[i % emojis.length]
          line += `${emoji} @${p.id.split('@')[0]}  `
          if ((i + 1) % 3 === 0) { txt += line + `\n`; line = '' }
        })
        if (line) txt += line + `\n`
        txt += `\n━━━━━━━━━━━━━━━━━━\n✅ *Total Tagged:* ${participants.length}\n🐺 *${settings.botName} TYPE 2*`
        await sock.sendMessage(m.key.remoteJid, { text: txt, mentions: participants.map(p => p.id) }, { quoted: m })
        return
      }

      if (command === 'hidetag') {
        const msg = text || `🐺 ${settings.botName} - HIDETAG TYPE 2`
        await sock.sendMessage(m.key.remoteJid, { text: msg, mentions: participants.map(p=>p.id) }, { quoted: m })
        return
      }

      if (command === 'admins' || command === 'listadmin') {
        const admins = participants.filter(p=>p.admin)
        let txt = `👑 *ADMINS TYPE 2 - ${metadata.subject}*\n\nTotal: ${admins.length}\nMode: ${settings.mode}\n\n`
        admins.forEach((a,i)=> txt += `${i+1}. @${a.id.split('@')[0]} - ${a.admin}\n`)
        await sock.sendMessage(m.key.remoteJid, { text: txt, mentions: admins.map(a=>a.id) }, { quoted: m })
        return
      }

      if (command === 'groupinfo') {
        return reply(`👥 *GROUP INFO TYPE 2*\n\nName: ${metadata.subject}\nID: ${metadata.id}\nOwner: ${metadata.owner ? '@'+metadata.owner.split('@')[0] : 'Unknown'}\nMembers: ${participants.length}\nAdmins: ${participants.filter(p=>p.admin).length}\nCreated: ${new Date(metadata.creation*1000).toLocaleString()}\nDesc: ${metadata.desc || 'None'}\n\n🛡️ AntiLink: ${groupDB.antilink} | Welcome: ${groupDB.welcome}\n🤖 Bot: ${settings.botName} TYPE 2\n\n🐺`)
      }
      if (command === 'groupname') return reply(`📛 Group Name: ${metadata.subject} | TYPE 2`)
      if (command === 'groupdesc') return reply(`📝 Group Desc: ${metadata.desc || 'None'} | TYPE 2`)
      if (command === 'membercount' || command === 'members') return reply(`👥 Members Count TYPE 2: ${participants.length}\n\n${participants.map(p=>`@${p.id.split('@')[0]}`).join('\n')}`, { mentions: participants.map(p=>p.id) })

      if (command === 'mute' || command === 'close' || command === 'group') {
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupSettingUpdate(m.key.remoteJid, 'announcement')
        return reply(`🔒 Group closed TYPE 2 - Only admins can send messages`)
      }
      if (command === 'unmute' || command === 'open') {
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupSettingUpdate(m.key.remoteJid, 'not_announcement')
        return reply(`🔓 Group opened TYPE 2 - All members can send`)
      }

      if (['revoke','newlink','resetlink','invite'].includes(command)) {
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupRevokeInvite(m.key.remoteJid)
        const code = await sock.groupInviteCode(m.key.remoteJid)
        return reply(`🔗 *NEW GROUP LINK TYPE 2*\n\nhttps://chat.whatsapp.com/${code}\n\n🐺 WOLF XMD TYPE 2`)
      }

      if (command === 'join') {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text.includes('chat.whatsapp.com')) return reply(`Usage: ${prefix}join <group link>`)
        const code = text.split('chat.whatsapp.com/')[1].trim()
        await sock.groupAcceptInvite(code)
        return reply(`✅ Joined group! TYPE 2`)
      }

      if (command === 'leave') {
        if (!isOwner && !senderAdmin) return reply(`❌ Owner/admin only`)
        await reply(`👋 Leaving... TYPE 2 | ${settings.botName}`)
        await sock.groupLeave(m.key.remoteJid)
        return
      }

      if (command === 'setname' || command === 'setsubject') {
        if (!text) return reply(`Usage: ${prefix}${command} <new name>`)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupUpdateSubject(m.key.remoteJid, text)
        return reply(`✅ Group name changed TYPE 2 to: ${text}`)
      }

      if (command === 'setdesc') {
        if (!text) return reply(`Usage: ${prefix}setdesc <new description>`)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        await sock.groupUpdateDescription(m.key.remoteJid, text)
        return reply(`✅ Description updated TYPE 2!`)
      }

      if (command === 'setgrouppic') {
        if (!botAdmin) return reply(`❌ Bot not admin`)
        const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
        let buf
        try {
          const { downloadMediaMessage } = require('@whiskeysockets/baileys')
          const pino = require('pino')
          buf = await downloadMediaMessage(quoted ? { message: quoted } : m, 'buffer', {}, { logger: pino({level:'silent'}), reuploadRequest: sock.updateMediaMessage })
        } catch {}
        if (!buf) return reply(`Reply image with ${prefix}setgrouppic | TYPE 2`)
        await sock.updateProfilePicture(m.key.remoteJid, buf)
        return reply(`✅ Group DP updated TYPE 2! 🐺`)
      }

      if (command === 'getgrouppic') {
        try {
          const url = await sock.profilePictureUrl(m.key.remoteJid, 'image')
          await sock.sendMessage(m.key.remoteJid, { image: { url }, caption: `🖼️ Group DP TYPE 2\n\n🐺 ${settings.botName}` }, { quoted: m })
        } catch { reply(`❌ No group DP or private | TYPE 2`) }
        return
      }

      if (command === 'listonline') {
        let online = participants.slice(0,10)
        return reply(`🟢 *ONLINE MEMBERS TYPE 2* (Sample)\n\n${online.map(p=>`@${p.id.split('@')[0]}`).join('\n')}\n\nTotal: ${participants.length}`, { mentions: online.map(p=>p.id) })
      }

      if (command === 'listmember') {
        let txt = `👥 *ALL MEMBERS TYPE 2*\n${metadata.subject}\nMode: ${settings.mode}\n\n`
        participants.forEach((p,i)=> txt += `${i+1}. @${p.id.split('@')[0]} ${p.admin ? '(ADMIN)' : ''}\n`)
        await sock.sendMessage(m.key.remoteJid, { text: txt, mentions: participants.map(p=>p.id) }, { quoted: m })
        return
      }

      if (command === 'tagadmin') {
        const admins = participants.filter(p=>p.admin)
        await sock.sendMessage(m.key.remoteJid, { text: `👑 Tag Admins TYPE 2: ${text}\n\n${admins.map(a=>`@${a.id.split('@')[0]}`).join(' ')}`, mentions: admins.map(a=>a.id) }, { quoted: m })
        return
      }
      if (command === 'tagmember') {
        await sock.sendMessage(m.key.remoteJid, { text: `👥 TYPE 2: ${text}`, mentions: participants.map(p=>p.id) }, { quoted: m })
        return
      }

      if (command === 'kickall') {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text.includes('CONFIRM')) return reply(`⚠️ DANGER TYPE 2! Type ${prefix}kickall CONFIRM to kick all members`)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        for (let p of participants) { if (!p.admin) await sock.groupParticipantsUpdate(m.key.remoteJid, [p.id], 'remove').catch(()=>{}) }
        return reply(`✅ All non-admins kicked TYPE 2`)
      }
      if (command === 'promoteall') {
        if (!isOwner) return reply(settings.mess.owner)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        for (let p of participants) await sock.groupParticipantsUpdate(m.key.remoteJid, [p.id], 'promote').catch(()=>{})
        return reply(`✅ All promoted TYPE 2`)
      }
      if (command === 'demoteall') {
        if (!isOwner) return reply(settings.mess.owner)
        if (!botAdmin) return reply(`❌ Bot not admin`)
        for (let p of participants.filter(p=>p.admin && !p.id.includes(botIdShort))) await sock.groupParticipantsUpdate(m.key.remoteJid, [p.id], 'demote').catch(()=>{})
        return reply(`✅ All demoted TYPE 2`)
      }

      if (['antidelete','welcome','goodbye','setwelcome','setgoodbye','delwelcome','delgoodbye'].includes(command)) {
        if (!senderAdmin) return reply(`❌ Admin only`)
        if (command === 'setwelcome') {
          if (!text) return reply(`Usage: ${prefix}setwelcome <message> Use @user for mention\nCurrent: ${groupDB.welcomeText}\nENV WELCOME=${settings.auto.welcome}`)
          groupDB.welcomeText = text
          groupDB.welcome = true
          return reply(`✅ Welcome TYPE 2 set: ${text}\nSet WELCOME=true in Dashboard ENV for permanent`)
        }
        if (command === 'setgoodbye') {
          if (!text) return reply(`Usage: ${prefix}setgoodbye <message>`)
          groupDB.goodbyeText = text
          return reply(`✅ Goodbye TYPE 2 set: ${text}`)
        }
        if (command === 'delwelcome') { groupDB.welcome = false; groupDB.welcomeText = ''; return reply(`✅ Welcome deleted TYPE 2 - Set WELCOME=false in Dashboard`) }
        if (command === 'delgoodbye') { groupDB.goodbyeText = ''; return reply(`✅ Goodbye deleted TYPE 2`) }
        if (command === 'welcome') return reply(`Welcome TYPE 2: ${groupDB.welcome ? 'ON' : 'OFF'} | ENV: ${settings.auto.welcome}\nText: ${groupDB.welcomeText}\nUsage: ${prefix}setwelcome hi @user welcome`)
        if (command === 'goodbye') return reply(`Goodbye TYPE 2: ${groupDB.goodbyeText || 'Not set'}`)
        if (command === 'antidelete') {
          if (!text) return reply(`${prefix}antidelete on/off - Current: ${groupDB.antidelete ? 'ON' : 'OFF'} | ENV: ${settings.auto.antidelete} | Path: ${settings.auto.antiDelPath}`)
          groupDB.antidelete = text === 'on'
          return reply(`🛡️ Antidelete TYPE 2 ${text.toUpperCase()} | Path: ${settings.auto.antiDelPath}`)
        }
      }

      if (['approve','reject','requests'].includes(command)) {
        if (!botAdmin) return reply(`❌ Bot not admin`)
        if (command === 'requests') {
          const reqs = await sock.groupRequestParticipantsList(m.key.remoteJid).catch(()=>[])
          return reply(`📩 Pending Requests TYPE 2: ${reqs.length}\n\n${reqs.map(r=>r.jid).join('\n') || 'None'}`)
        }
        if (command === 'approve') {
          const reqs = await sock.groupRequestParticipantsList(m.key.remoteJid)
          for (let r of reqs) await sock.groupRequestParticipantsUpdate(m.key.remoteJid, [r.jid], 'approve')
          return reply(`✅ Approved ${reqs.length} requests TYPE 2`)
        }
        if (command === 'reject') {
          const reqs = await sock.groupRequestParticipantsList(m.key.remoteJid)
          for (let r of reqs) await sock.groupRequestParticipantsUpdate(m.key.remoteJid, [r.jid], 'reject')
          return reply(`❌ Rejected ${reqs.length} requests TYPE 2`)
        }
      }

      if (command === 'poll') {
        if (!text.includes('|')) return reply(`Usage: ${prefix}poll Question | Option1 | Option2 | Option3 | TYPE 2`)
        const [q, ...opts] = text.split('|').map(s=>s.trim())
        await sock.sendMessage(m.key.remoteJid, { poll: { name: q, values: opts, selectableCount: 1 } }, { quoted: m })
        return
      }
      if (command === 'vote') return reply(`🗳️ Vote using poll above! TYPE 2`)
      if (command === 'gstatus') {
        return reply(`✅ Group Status TYPE 2 feature - ${settings.botName}\nMode: ${settings.mode}\nMembers: ${participants.length}`)
      }

    } catch (e) {
      console.log(`Group TYPE 2 Error ${command}: ${e.message}`)
      reply(`❌ Group TYPE 2 Error: ${e.message}\nBot needs admin! Make bot admin 🐺\nMode: ${settings.mode}`)
    }
  }
          }
