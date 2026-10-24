// 🤖 ALPHA AND OMEGA WOLF XMD - AUTO PLUGIN - TYPE 2 DASHBOARD - 50 CMDS
const settings = require('../settings')

module.exports = {
  command: ['autoread','autotyping','autorecording','autobio','autostatus','autostatusview','autostatuslike','autostatusreact','autoreact','autolike','autoreadstatus','autodlstatus','autoblock','autounblock','autokick','autoban','autowarn','autodelete','antidelete','autosticker','autorespond','autochat','autoai','autolevel','autojoin','autoleave','autogroup','autoreject','autoapprove','autosave','autobackup','autoclean','autopurge','autoping','autopresence','autoreadgc','autoreadpc','autodownload','autoview','autoseen','autopost','autoreply','autovoice','setauto','autonsfw','antinsfwauto','autogc','autopc','autocall','setautobio','setreact'],

  execute: async (sock, m, { command, text, reply, isOwner, prefix }) => {
    // TYPE 2: Use central DB and settings
    global.db = global.db || {}
    global.db.settings = global.db.settings || {
      autoread: settings.auto.autoRead,
      autotyping: settings.auto.autoTyping,
      autorecording: settings.auto.autoRecording,
      autoviewstatus: settings.auto.autoViewStatus,
      autolikestatus: settings.auto.autoLikeStatus,
      autoreact: settings.auto.autoReact,
      antidelete: settings.auto.antidelete,
      autobio: settings.auto.autoBio,
      autobioText: settings.auto.autoBioText || '🐺 WOLF XMD | {time}',
      reactEmoji: '🐺',
      ...settings.auto
    }
    
    const db = global.db.settings

    try {
      // TYPE 2: setauto shows dashboard ENV status
      if (command === 'setauto') {
        if (!isOwner) return reply(settings.mess.owner)
        let txt = `🤖 *AUTO SETTINGS TYPE 2 - DASHBOARD ENV*\n\n`
        txt += `📊 *DASHBOARD ENV (Render)*:\n`
        txt += `${settings.auto.autoRead ? '🟢' : '🔴'} AUTO_READ: ${settings.auto.autoRead}\n`
        txt += `${settings.auto.autoTyping ? '🟢' : '🔴'} AUTO_TYPING: ${settings.auto.autoTyping}\n`
        txt += `${settings.auto.autoRecording ? '🟢' : '🔴'} AUTO_RECORDING: ${settings.auto.autoRecording}\n`
        txt += `${settings.auto.autoViewStatus ? '🟢' : '🔴'} AUTO_VIEW_STATUS: ${settings.auto.autoViewStatus}\n`
        txt += `${settings.auto.autoLikeStatus ? '🟢' : '🔴'} AUTO_LIKE_STATUS: ${settings.auto.autoLikeStatus}\n`
        txt += `${settings.auto.autoReact ? '🟢' : '🔴'} AUTO_REACT: ${settings.auto.autoReact}\n`
        txt += `${settings.auto.antidelete ? '🟢' : '🔴'} ANTIDELETE: ${settings.auto.antidelete} (${settings.auto.antiDelPath})\n`
        txt += `${settings.auto.autoBio ? '🟢' : '🔴'} AUTO_BIO: ${settings.auto.autoBio}\n`
        txt += `${settings.auto.antiLink ? '🟢' : '🔴'} ANTI_LINK: ${settings.auto.antiLink}\n`
        txt += `${settings.auto.antiCall ? '🟢' : '🔴'} ANTI_CALL: ${settings.auto.antiCall}\n`
        txt += `${settings.auto.welcome ? '🟢' : '🔴'} WELCOME: ${settings.auto.welcome}\n`
        txt += `\n💾 *RUNTIME DB (can change via cmd)*:\n`
        for (let [k,v] of Object.entries(db)) {
          if (typeof v === 'boolean') txt += `${v ? '🟢' : '🔴'} ${k}: ${v ? 'ON' : 'OFF'}\n`
        }
        txt += `\nReact Emoji: ${db.reactEmoji || '🐺'}\nBio Text: ${db.autobioText || db.autobioText}\n\n`
        txt += `⚙️ To permanently change, set in Render Dashboard ENV:\nAUTO_READ=true, etc.\n\n`
        txt += `Use ${prefix}<feature> on/off for runtime change\n\n🐺 ALPHA AND OMEGA TYPE 2`
        return reply(txt)
      }

      // Only owner can change auto settings
      const ownerOnly = ['autoread','autotyping','autorecording','autobio','autostatus','autostatusview','autostatuslike','autostatusreact','autoreact','autolike','antidelete','autodelete','autopresence','autoseen','autoview']
      if (ownerOnly.includes(command) && !isOwner) return reply(settings.mess.owner)

      if (['autoread','autoreadgc','autoreadpc','autoseen','autoview','autoreadstatus','autodlstatus','autostatusview','autostatus','autopresence','autoping','autostatuslike','autostatusreact'].includes(command)) {
        if (!text) {
          const envKey = command.toUpperCase()
          const envVal = settings.auto[command] ?? 'Not set'
          return reply(`*${command} TYPE 2*\nRuntime: ${db[command] ? 'ON 🟢' : 'OFF 🔴'}\nENV: ${envVal}\nUsage: ${prefix}${command} on/off\n\nSet in Dashboard for permanent: ${envKey}=true`)
        }
        db[command] = text === 'on'
        db.autoread = db.autoread || db.autoreadgc
        return reply(`✅ ${command} ${text === 'on' ? 'ENABLED 🟢 TYPE 2' : 'DISABLED 🔴'} (Runtime)\nTo make permanent: Set ${command.toUpperCase()}=${text} in Render ENV 🐺`)
      }

      if (['autotyping','autorecording'].includes(command)) {
        if (!text) return reply(`Current ${command} TYPE 2:\nRuntime: ${db[command] ? 'ON 🟢' : 'OFF 🔴'}\nENV: ${command === 'autotyping' ? settings.auto.autoTyping : settings.auto.autoRecording}\nUsage: ${prefix}${command} on/off`)
        db[command] = text === 'on'
        return reply(`✅ ${command} ${text === 'on' ? 'ENABLED 🟢 TYPE 2' : 'DISABLED'} 🐺\nENV: Set ${command.toUpperCase()}=${text} in Dashboard for permanent`)
      }

      if (command === 'autobio' || command === 'setautobio') {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text) return reply(`*AutoBio TYPE 2*\nRuntime: ${db.autobio ? 'ON 🟢' : 'OFF'}\nENV: ${settings.auto.autoBio ? 'ON' : 'OFF'}\nText: ${db.autobioText}\nENV Text: ${settings.auto.autoBioText}\n\nUsage:\n${prefix}autobio on/off\n${prefix}autobio your text {time}\n\nSet AUTO_BIO=true and AUTOBIO_TEXT in Dashboard for permanent 🐺`)
        if (text === 'on' || text === 'off') {
          db.autobio = text === 'on'
          if (text === 'on') {
            // Auto bio handled in connection.js interval
            await sock.updateProfileStatus(db.autobioText.replace('{time}', new Date().toLocaleTimeString('en-US', {timeZone: 'Africa/Lagos'}))).catch(()=>{})
          }
          return reply(`✅ AutoBio ${text.toUpperCase()} TYPE 2 🐺\nTo make permanent set AUTO_BIO=${text} in Dashboard`)
        } else {
          db.autobioText = text
          db.autobio = true
          await sock.updateProfileStatus(text.replace('{time}', new Date().toLocaleTimeString()).replace('{date}', new Date().toLocaleDateString())).catch(()=>{})
          return reply(`✅ Bio set TYPE 2: ${text}\nNow updating... Set AUTOBIO_TEXT in Dashboard ENV for permanent 🐺`)
        }
      }

      if (['autoreact','autolike','autostatuslike','autostatusreact','setreact'].includes(command)) {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text) return reply(`Current ${command} TYPE 2:\nRuntime: ${db[command] ? 'ON 🟢' : 'OFF'} | Emoji: ${db.reactEmoji}\nENV AutoReact: ${settings.auto.autoReact}\nENV HeartReact: ${settings.auto.heartReact}\nUsage: ${prefix}${command} on/off or emoji like ❤️\nSet AUTO_REACT=true in Dashboard`)
        if (text.length <= 4 && !['on','off'].includes(text.toLowerCase())) {
          db.reactEmoji = text
          db.autoreact = true
          return reply(`✅ Emoji set to ${text} TYPE 2 🐺\nSet HEART_REACT=true or AUTO_REACT=true in Dashboard`)
        }
        db[command] = text === 'on'
        return reply(`✅ ${command} ${text.toUpperCase()} TYPE 2 🐺`)
      }

      if (['antidelete','autodelete'].includes(command)) {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text) return reply(`*AntiDelete TYPE 2*\nRuntime: ${db.antidelete ? 'ON 🟢' : 'OFF 🔴'}\nENV: ${settings.auto.antidelete ? 'ON' : 'OFF'}\nPath: ${settings.auto.antiDelPath} (log or same)\nUsage: ${prefix}antidelete on/off\nSet ANTIDELETE=true and ANTI_DEL_PATH in Dashboard ENV 🐺`)
        db.antidelete = text === 'on'
        return reply(`✅ AntiDelete ${text.toUpperCase()} TYPE 2 🐺\nPath: ${settings.auto.antiDelPath}\nSet in ENV for permanent`)
      }

      const others = ['autosticker','autorespond','autochat','autoai','autolevel','autojoin','autoleave','autogroup','autoreject','autoapprove','autosave','autobackup','autoclean','autopurge','autodownload','autopost','autoreply','autovoice','autonsfw','antinsfwauto','autogc','autopc','autocall','autoblock','autounblock','autokick','autoban','autowarn']
      if (others.includes(command)) {
        if (!isOwner) return reply(settings.mess.owner)
        if (!text) return reply(`Current ${command} TYPE 2: ${db[command] ? 'ON 🟢' : 'OFF 🔴'}\nUsage: ${prefix}${command} on/off\n\nFor permanent set in Dashboard ENV`)
        db[command] = text === 'on'
        return reply(`✅ ${command} ${text.toUpperCase()} TYPE 2 🐺\nRuntime only - Set in ENV for permanent`)
      }

    } catch (e) {
      console.log(`Auto TYPE 2 Error ${command}: ${e.message}`)
      reply(`❌ Auto TYPE 2 Error: ${e.message} 🐺\nCheck Dashboard ENV settings`)
    }
  }
          }
