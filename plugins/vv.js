// 👁️ ALPHA AND OMEGA WOLF XMD - VV 10 CMDS FIXED
const { downloadMediaMessage } = require('@whiskeysockets/baileys')

module.exports = {
  command: ['vv','viewonce','vv2','vv3','vvimage','vvvideo','vvaudio','vvall','autovv','antiviewonce'],

  execute: async (sock, m, { command, text, reply }) => {
    global.wolfDB = global.wolfDB || { auto: { autovv: true }, owners: [] }
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

    try {
      if (['autovv','antiviewonce'].includes(command)) {
        if (!text) return reply(`👁️ AutoVV: ${global.wolfDB.auto.autovv ? 'ON 🟢' : 'OFF 🔴'}\nUsage: .autovv on/off\n🐺`)
        global.wolfDB.auto.autovv = text.toLowerCase() === 'on'
        return reply(`✅ AutoVV ${global.wolfDB.auto.autovv ? 'ENABLED 🟢' : 'DISABLED 🔴'} 🐺`)
      }

      if (command === 'vvall') {
        return reply(`👁️ *VV ALL*\n.vv - bypass\n.vv2 - save with info\n.vv3 - forward to owner\n.vvimage - image only\n.vvvideo - video only\n.vvaudio - audio only\n.autovv on/off\n\n🐺 ALPHA AND OMEGA`)
      }

      // Get viewOnce container
      let quotedMsg = null
      if (quoted) {
        quotedMsg = quoted.viewOnceMessage?.message || quoted.viewOnceMessageV2?.message || quoted.viewOnceMessageV2Extension?.message || quoted
      } else if (m.message?.viewOnceMessage) {
        quotedMsg = m.message.viewOnceMessage.message
      } else if (m.message?.viewOnceMessageV2) {
        quotedMsg = m.message.viewOnceMessageV2.message
      }

      if (!quotedMsg) {
        return reply(`👁️ *VV - VIEW ONCE BYPASS*\n\n❌ Reply to a view-once image/video/voice with .${command}\n\n🐺 WOLF XMD`)
      }

      const type = Object.keys(quotedMsg)[0]
      if (!['imageMessage','videoMessage','audioMessage'].includes(type)) {
        return reply(`❌ Not viewOnce media. Found: ${type}`)
      }

      // FIX: Download buffer instead of sending raw object
      const buffer = await downloadMediaMessage({ message: quotedMsg }, 'buffer', {}, { logger: undefined, reuploadRequest: sock.updateMediaMessage })

      if (command === 'vv' || command === 'viewonce') {
        if (type === 'imageMessage') await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ *VV BYPASS - IMAGE OPENED*\n\n🐺 ALPHA AND OMEGA WOLF XMD` }, { quoted: m })
        if (type === 'videoMessage') await sock.sendMessage(m.chat, { video: buffer, caption: `👁️ *VV BYPASS - VIDEO OPENED*\n\n🐺 WOLF XMD` }, { quoted: m })
        if (type === 'audioMessage') await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: quotedMsg[type].ptt || false }, { quoted: m })
        return reply(`✅ *VIEW ONCE BYPASSED!* 👁️ Type: ${type.replace('Message','')} 🐺`)
      }

      if (command === 'vv2') {
        if (type === 'imageMessage') await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ *VV2 - SAVED*\nSize: ${quotedMsg[type].fileLength || 'unknown'}\n🐺 WOLF XMD` }, { quoted: m })
        if (type === 'videoMessage') await sock.sendMessage(m.chat, { video: buffer, caption: `👁️ *VV2 - VIDEO SAVED* 🐺` }, { quoted: m })
        if (type === 'audioMessage') await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
        return
      }

      if (command === 'vv3') {
        const owner = global.wolfDB.owners?.[0] || sock.user.id
        if (type === 'imageMessage') {
          await sock.sendMessage(owner, { image: buffer, caption: `👁️ VV3 from ${m.chat}` })
          await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ VV3 - Also forwarded to owner! 🐺` }, { quoted: m })
        } else {
          await sock.sendMessage(owner, { [type.replace('Message','')]: buffer })
          await sock.sendMessage(m.chat, { text: `✅ VV3 - Forwarded to owner + here! 🐺` })
        }
        return
      }

      if (command === 'vvimage') {
        if (type !== 'imageMessage') return reply(`❌ Not image. Type: ${type}`)
        await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ VVIMAGE - Extracted! 🐺` }, { quoted: m })
        return
      }

      if (command === 'vvvideo') {
        if (type !== 'videoMessage') return reply(`❌ Not video. Type: ${type}`)
        await sock.sendMessage(m.chat, { video: buffer, caption: `👁️ VVVIDEO - Extracted! 🐺` }, { quoted: m })
        return
      }

      if (command === 'vvaudio') {
        if (type !== 'audioMessage') return reply(`❌ Not audio. Type: ${type}`)
        await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: quotedMsg[type].ptt || false }, { quoted: m })
        return
      }

    } catch (e) {
      console.log(e)
      reply(`❌ VV Error: ${e.message}\nMake sure you reply view-once with .vv 🐺`)
    }
  }
          }
