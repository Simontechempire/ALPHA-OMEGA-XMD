// 👁️ ALPHA AND OMEGA WOLF XMD - VV PLUGIN - TYPE 2 DASHBOARD - 10 CMDS
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const pino = require('pino')
const settings = require('../settings')

module.exports = {
  command: ['vv','viewonce','vv2','vv3','vvimage','vvvideo','vvaudio','vvall','autovv','antiviewonce'],

  execute: async (sock, m, { command, text, reply, isOwner, prefix }) => {
    // TYPE 2: Use dashboard settings
    global.db = global.db || {}
    global.db.settings = global.db.settings || {}
    if (typeof global.db.settings.autovv === 'undefined') {
      global.db.settings.autovv = settings.auto.autoVV !== false
    }

    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

    try {
      // TYPE 2: autovv controlled from ENV + command
      if (['autovv','antiviewonce'].includes(command)) {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text) {
          const status = global.db.settings.autovv ? 'ON 🟢 TYPE 2' : 'OFF 🔴'
          const envStatus = settings.auto.autoVV ? 'ENV ON' : 'ENV OFF'
          return reply(`👁️ *AutoVV TYPE 2*\n\nCurrent: ${status}\nDashboard ENV: ${envStatus}\n\nUsage: ${prefix}autovv on/off\nPath: ${settings.auto.antiDelPath}\n\n🐺 ALPHA AND OMEGA TYPE 2`)
        }
        global.db.settings.autovv = text.toLowerCase() === 'on'
        return reply(`✅ AutoVV ${global.db.settings.autovv ? 'ENABLED 🟢 TYPE 2' : 'DISABLED 🔴'} 🐺\nDashboard ENV still: ${settings.auto.autoVV ? 'ON' : 'OFF'}`)
      }

      if (command === 'vvall') {
        return reply(`👁️ *VV ALL - TYPE 2*\n\n${prefix}vv - bypass\n${prefix}vv2 - save with info\n${prefix}vv3 - forward to owner\n${prefix}vvimage - image only\n${prefix}vvvideo - video only\n${prefix}vvaudio - audio only\n${prefix}autovv on/off - TYPE 2 Dashboard synced\n\nAutoVV: ${global.db.settings.autovv ? 'ON' : 'OFF'} | ENV: ${settings.auto.autoVV ? 'ON' : 'OFF'}\nAntiDelPath: ${settings.auto.antiDelPath}\n\n🐺 ALPHA AND OMEGA TYPE 2`)
      }

      // Get viewOnce container - TYPE 2 improved detection
      let quotedMsg = null
      if (quoted) {
        quotedMsg = quoted.viewOnceMessage?.message || quoted.viewOnceMessageV2?.message || quoted.viewOnceMessageV2Extension?.message || quoted.viewOnceMessage || quoted
      } else if (m.message?.viewOnceMessage) {
        quotedMsg = m.message.viewOnceMessage.message
      } else if (m.message?.viewOnceMessageV2) {
        quotedMsg = m.message.viewOnceMessageV2.message
      } else if (m.message?.viewOnceMessageV2Extension) {
        quotedMsg = m.message.viewOnceMessageV2Extension.message
      }

      if (!quotedMsg || typeof quotedMsg !== 'object') {
        return reply(`👁️ *VV - VIEW ONCE BYPASS TYPE 2*\n\n❌ Reply to a view-once image/video/voice with ${prefix}${command}\n\nAlso auto works if AUTO_VIEW_STATUS or autovv is ON in dashboard.\n\n🐺 WOLF XMD TYPE 2`)
      }

      const type = Object.keys(quotedMsg)[0]
      if (!['imageMessage','videoMessage','audioMessage'].includes(type)) {
        // Try deeper
        if (quotedMsg.imageMessage) {
          quotedMsg = { imageMessage: quotedMsg.imageMessage }
        } else if (quotedMsg.videoMessage) {
          quotedMsg = { videoMessage: quotedMsg.videoMessage }
        } else {
          return reply(`❌ Not viewOnce media. Found: ${type}\nTry ${prefix}vvall`)
        }
      }

      const actualType = Object.keys(quotedMsg)[0]

      // TYPE 2 FIX: Proper buffer download with pino
      const buffer = await downloadMediaMessage(
        { message: quotedMsg }, 
        'buffer', 
        {}, 
        { logger: pino({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage }
      )

      if (!buffer) return reply(`❌ Failed to download media buffer. Try again 🐺`)

      if (command === 'vv' || command === 'viewonce') {
        if (actualType === 'imageMessage') await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ *VV BYPASS - IMAGE OPENED TYPE 2*\n\nFrom: AutoVV ${global.db.settings.autovv ? 'ON' : 'OFF'} | ENV ${settings.auto.autoVV ? 'ON' : 'OFF'}\n\n🐺 ALPHA AND OMEGA WOLF XMD TYPE 2` }, { quoted: m })
        if (actualType === 'videoMessage') await sock.sendMessage(m.chat, { video: buffer, caption: `👁️ *VV BYPASS - VIDEO OPENED TYPE 2*\n\n🐺 WOLF XMD` }, { quoted: m })
        if (actualType === 'audioMessage') await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: quotedMsg[actualType].ptt || false }, { quoted: m })
        return reply(`✅ *VIEW ONCE BYPASSED!* 👁️ Type: ${actualType.replace('Message','')} | TYPE 2 🐺`)
      }

      if (command === 'vv2') {
        if (actualType === 'imageMessage') await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ *VV2 - SAVED TYPE 2*\nSize: ${quotedMsg[actualType].fileLength || 'unknown'}\nAntiDel: ${settings.auto.antiDelPath}\n🐺 WOLF XMD` }, { quoted: m })
        if (actualType === 'videoMessage') await sock.sendMessage(m.chat, { video: buffer, caption: `👁️ *VV2 - VIDEO SAVED TYPE 2* 🐺` }, { quoted: m })
        if (actualType === 'audioMessage') await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: m })
        return
      }

      if (command === 'vv3') {
        const ownerJid = settings.ownerNumber + "@s.whatsapp.net"
        if (actualType === 'imageMessage') {
          await sock.sendMessage(ownerJid, { image: buffer, caption: `👁️ VV3 TYPE 2 from ${m.chat} | ${m.sender}` }).catch(()=>{})
          await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ VV3 - Also forwarded to owner! 🐺 TYPE 2` }, { quoted: m })
        } else {
          await sock.sendMessage(ownerJid, { [actualType.replace('Message','')]: buffer, caption: `VV3 TYPE 2 from ${m.chat}` }).catch(()=>{})
          await sock.sendMessage(m.chat, { text: `✅ VV3 - Forwarded to owner + here! 🐺 TYPE 2` })
        }
        return
      }

      if (command === 'vvimage') {
        if (actualType !== 'imageMessage') return reply(`❌ Not image. Type: ${actualType}`)
        await sock.sendMessage(m.chat, { image: buffer, caption: `👁️ VVIMAGE - Extracted TYPE 2! 🐺` }, { quoted: m })
        return
      }

      if (command === 'vvvideo') {
        if (actualType !== 'videoMessage') return reply(`❌ Not video. Type: ${actualType}`)
        await sock.sendMessage(m.chat, { video: buffer, caption: `👁️ VVVIDEO - Extracted TYPE 2! 🐺` }, { quoted: m })
        return
      }

      if (command === 'vvaudio') {
        if (actualType !== 'audioMessage') return reply(`❌ Not audio. Type: ${actualType}`)
        await sock.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mp4', ptt: quotedMsg[actualType].ptt || false }, { quoted: m })
        return
      }

    } catch (e) {
      console.log(`[WOLF VV TYPE 2 Error] ${e.message}`, e.stack)
      reply(`❌ VV TYPE 2 Error: ${e.message}\nMake sure you reply view-once with ${settings.prefix}vv 🐺\nCheck AUTO_VIEW_STATUS ENV is true for auto.`)
    }
  }
  }
