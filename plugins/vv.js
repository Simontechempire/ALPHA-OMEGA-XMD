// 👁️ ALPHA AND OMEGA WOLF XMD - VV 10 CMDS REAL
module.exports = {
  command: ['vv','viewonce','vv2','vv3','vvimage','vvvideo','vvaudio','vvall','autovv','antiviewonce'],

  execute: async (sock, m, { command, text, reply }) => {
    global.wolfDB = global.wolfDB || { auto: { autovv: true } }
    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage

    try {
      // .autovv / .antiviewonce toggle
      if (['autovv','antiviewonce'].includes(command)) {
        if (!text) return reply(`👁️ AutoVV: ${global.wolfDB.auto.autovv ? 'ON 🟢' : 'OFF 🔴'}\nUsage: .autovv on/off\n\nWhen ON, all view-once auto opened! 🐺`)
        global.wolfDB.auto.autovv = text === 'on'
        return reply(`✅ AutoVV ${text === 'on' ? 'ENABLED 🟢 - All view-once will be auto bypassed!' : 'DISABLED 🔴'} 🐺`)
      }

      // .vvall - list all viewonce logic
      if (command === 'vvall') {
        return reply(`👁️ *VV ALL - VIEW ONCE LIST*\n\nCommands:\n.vv - Reply viewonce to bypass\n.vv2 - Bypass + save to phone\n.vv3 - Bypass + forward to owner\n.vvimage - Extract image only\n.vvvideo - Extract video only\n.vvaudio - Extract audio only\n.autovv on/off - Auto bypass\n\n🐺 ALPHA AND OMEGA`)
      }

      // Check for viewOnce message
      let viewOnceData = null
      let mediaMessage = null

      // 1. Check quoted message is viewOnce
      if (quoted) {
        if (quoted.viewOnceMessage) { viewOnceData = quoted.viewOnceMessage; mediaMessage = quoted.viewOnceMessage.message }
        else if (quoted.viewOnceMessageV2) { viewOnceData = quoted.viewOnceMessageV2; mediaMessage = quoted.viewOnceMessageV2.message }
        else if (quoted.viewOnceMessageV2Extension) { viewOnceData = quoted.viewOnceMessageV2Extension; mediaMessage = quoted.viewOnceMessageV2Extension.message }
        else mediaMessage = quoted // maybe already extracted
      }

      // 2. Check current message itself is viewOnce (if bot receives)
      if (!mediaMessage && m.message?.viewOnceMessage) { mediaMessage = m.message.viewOnceMessage.message; viewOnceData = m.message.viewOnceMessage }
      if (!mediaMessage && m.message?.viewOnceMessageV2) { mediaMessage = m.message.viewOnceMessageV2.message; viewOnceData = m.message.viewOnceMessageV2 }

      if (!mediaMessage) {
        return reply(`👁️ *VV - VIEW ONCE BYPASS*\n\n❌ Reply to a view-once image/video/voice with .${command}\n\nEx: Reply view-once pic with .vv\n\n🐺 WOLF XMD - VV READY`)
      }

      // Extract media type
      const type = Object.keys(mediaMessage)[0] // imageMessage, videoMessage, audioMessage
      const media = mediaMessage[type]

      // .vv - normal bypass
      if (command === 'vv' || command === 'viewonce') {
        if (type === 'imageMessage') {
          await sock.sendMessage(m.key.remoteJid, { image: media, caption: `👁️ *VV BYPASS - IMAGE OPENED*\n\nOriginal was view-once\nNow saved! 🐺\n\nALPHA AND OMEGA WOLF XMD` }, { quoted: m })
        } else if (type === 'videoMessage') {
          await sock.sendMessage(m.key.remoteJid, { video: media, caption: `👁️ *VV BYPASS - VIDEO OPENED*\n\n🐺 WOLF XMD` }, { quoted: m })
        } else if (type === 'audioMessage') {
          await sock.sendMessage(m.key.remoteJid, { audio: media, mimetype: 'audio/mp4', ptt: media.ptt || false }, { quoted: m })
        } else {
          await sock.sendMessage(m.key.remoteJid, { forward: mediaMessage }, { quoted: m })
        }
        return reply(`✅ *VIEW ONCE BYPASSED!* 👁️\nType: ${type.replace('Message','')}\nSaved above! 🐺`)
      }

      // .vv2 - bypass + save with info
      if (command === 'vv2') {
        if (type === 'imageMessage') {
          await sock.sendMessage(m.key.remoteJid, { image: media, caption: `👁️ *VV2 - SAVED*\n\nFile: viewonce-image.jpg\nSize: ${media.fileLength || 'unknown'}\nViewOnce: Bypassed ✅\n\n🐺 WOLF XMD - SAVED TO CHAT` }, { quoted: m })
        } else if (type === 'videoMessage') {
          await sock.sendMessage(m.key.remoteJid, { video: media, caption: `👁️ *VV2 - VIDEO SAVED*\n\n🐺` }, { quoted: m })
        }
        return reply(`✅ VV2 - Media saved + forwarded with details! 🐺`)
      }

      // .vv3 - bypass + forward to owner
      if (command === 'vv3') {
        const owner = global.wolfDB?.owners?.[0] || sock.user.id
        if (type === 'imageMessage') {
          await sock.sendMessage(owner, { image: media, caption: `👁️ VV3 from ${m.key.remoteJid}\nBypassed view-once` })
          await sock.sendMessage(m.key.remoteJid, { image: media, caption: `👁️ VV3 - Also forwarded to owner! 🐺` }, { quoted: m })
        } else {
          await sock.sendMessage(owner, { forward: mediaMessage })
          await sock.sendMessage(m.key.remoteJid, { text: `✅ VV3 - Forwarded to owner + here! 🐺` })
        }
        return
      }

      // .vvimage - only images
      if (command === 'vvimage') {
        if (type !== 'imageMessage') return reply(`❌ This is not image view-once. Type: ${type}`)
        await sock.sendMessage(m.key.remoteJid, { image: media, caption: `👁️ VVIMAGE - Extracted!\n\n🐺` }, { quoted: m })
        return reply(`✅ Image extracted! 🐺`)
      }

      // .vvvideo - only videos
      if (command === 'vvvideo') {
        if (type !== 'videoMessage') return reply(`❌ Not video view-once. Type: ${type}`)
        await sock.sendMessage(m.key.remoteJid, { video: media, caption: `👁️ VVVIDEO - Extracted! 🐺` }, { quoted: m })
        return reply(`✅ Video extracted! 🐺`)
      }

      // .vvaudio - only audio
      if (command === 'vvaudio') {
        if (type !== 'audioMessage') return reply(`❌ Not audio view-once. Type: ${type}`)
        await sock.sendMessage(m.key.remoteJid, { audio: media, mimetype: 'audio/mp4', ptt: media.ptt || false }, { quoted: m })
        return reply(`✅ Audio extracted! 🐺`)
      }

    } catch (e) {
      reply(`❌ VV Error: ${e.message}\nMake sure you reply view-once message with .vv 🐺`)
    }
  }
}
