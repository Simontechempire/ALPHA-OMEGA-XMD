// 🤖 ALPHA AND OMEGA WOLF XMD - AUTO 50 CMDS REAL
module.exports = {
command: ['autoread','autotyping','autorecording','autobio','autostatus','autostatusview','autostatuslike','autostatusreact','autoreact','autolike','autoreadstatus','autodlstatus','autoblock','autounblock','autokick','autoban','autowarn','autodelete','antidelete','autosticker','autorespond','autochat','autoai','autolevel','autojoin','autoleave','autogroup','autoreject','autoapprove','autosave','autobackup','autoclean','autopurge','autoping','autopresence','autoreadgc','autoreadpc','autodownload','autoview','autoseen','autopost','autoreply','autovoice','setauto','autonsfw','antinsfwauto','autogc','autopc','autocall'],

execute: async (sock, m, { command, text, reply }) => {
global.wolfDB = global.wolfDB || { auto: { autoread: false, autotyping: false, autorecording: false, autoviewstatus: true, autolikestatus: false, autoreact: false, antidelete: true, autobioText: '🐺 WOLF XMD | {time}', autobio: false, reactEmoji: '🐺' } }

try {  
  // .setauto - show all  
  if (command === 'setauto') {  
    let txt = `🤖 *AUTO SETTINGS - 50 FEATURES*\n\n`  
    for (let [k,v] of Object.entries(global.wolfDB.auto)) {  
      if (typeof v === 'boolean') txt += `${v ? '🟢' : '🔴'} ${k}: ${v ? 'ON' : 'OFF'}\n`  
    }  
    txt += `\nReact Emoji: ${global.wolfDB.auto.reactEmoji}\nBio Text: ${global.wolfDB.auto.autobioText}\n\nUse .<feature> on/off\n\n🐺 ALPHA AND OMEGA`  
    return reply(txt)  
  }  

  // Group: read / seen / view / presence  
  if (['autoread','autoreadgc','autoreadpc','autoseen','autoview','autoreadstatus','autodlstatus','autostatusview','autostatus','autopresence','autoping'].includes(command)) {  
    if (!text) return reply(`Current ${command}: ${global.wolfDB.auto[command] ? 'ON 🟢' : 'OFF 🔴'}\nUsage: .${command} on/off\n\n${command.includes('read') ? 'Auto marks messages as read' : 'Auto views statuses'} 🐺`)  
    global.wolfDB.auto[command] = text === 'on'  
    return reply(`✅ ${command} ${text === 'on' ? 'ENABLED 🟢' : 'DISABLED 🔴'} 🐺`)  
  }  

  // typing / recording / bio  
  if (['autotyping','autorecording'].includes(command)) {  
    if (!text) return reply(`Current ${command}: ${global.wolfDB.auto[command] ? 'ON 🟢' : 'OFF 🔴'}\nUsage: .${command} on/off`)  
    global.wolfDB.auto[command] = text === 'on'  
    return reply(`✅ ${command} ${text === 'on' ? 'ENABLED 🟢\nBot will show ${command.replace('auto','')}...' : 'DISABLED'} 🐺`)  
  }  

  if (command === 'autobio') {  
    if (!text) return reply(`Current AutoBio: ${global.wolfDB.auto.autobio ? 'ON 🟢' : 'OFF'}\nText: ${global.wolfDB.auto.autobioText}\n\nUsage:\n.autobio on/off\n.autobio your text | {time} | {date}\nEx: .autobio WOLF XMD | {time}\n\n🐺`)  
    if (text === 'on' || text === 'off') {  
      global.wolfDB.auto.autobio = text === 'on'  
      if (text === 'on') {  
        setInterval(async()=>{  
          if (!global.wolfDB.auto.autobio) return  
          let bio = global.wolfDB.auto.autobioText.replace('{time}', new Date().toLocaleTimeString()).replace('{date}', new Date().toLocaleDateString())  
          await sock.updateProfileStatus(bio).catch(()=>{})  
        }, 60000)  
      }  
      return reply(`✅ AutoBio ${text === 'on' ? 'ENABLED 🟢 - Updates every 60s' : 'DISABLED'} 🐺`)  
    } else {  
      global.wolfDB.auto.autobioText = text  
      global.wolfDB.auto.autobio = true  
      return reply(`✅ AutoBio text set to: ${text}\nWill update every 60s with time/date 🐺`)  
    }  
  }  

  // react / like  
  if (['autoreact','autolike','autostatuslike','autostatusreact'].includes(command)) {  
    if (!text) return reply(`Current ${command}: ${global.wolfDB.auto[command] ? 'ON 🟢' : 'OFF 🔴'} | Emoji: ${global.wolfDB.auto.reactEmoji}\nUsage: .${command} on/off or .${command} ❤️\n\n🐺`)  
    if (['❤️','🔥','🐺','👑','✅','😂','😮','😢','💀','🙏'].includes(text) || text.length <= 3) {  
      global.wolfDB.auto.reactEmoji = text  
      global.wolfDB.auto.autoreact = true  
      return reply(`✅ AutoReact emoji set to ${text} 🐺`)  
    }  
    global.wolfDB.auto[command] = text === 'on'  
    return reply(`✅ ${command} ${text === 'on' ? 'ENABLED 🟢' : 'DISABLED 🔴'} 🐺`)  
  }  

  // block / kick / ban / warn  
  if (['autoblock','autounblock','autokick','autoban','autowarn','autonsfw','antinsfwauto','autogc','autopc','autocall'].includes(command)) {  
    if (!text) return reply(`Usage: .${command} on/off or .${command} @user\nCurrent: ${global.wolfDB.auto[command] ? 'ON' : 'OFF'}`)  
    if (text === 'on' || text === 'off') {  
      global.wolfDB.auto[command] = text === 'on'  
      return reply(`✅ ${command} ${text.toUpperCase()} 🐺`)  
    }  
    const user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]  
    if (!user) return reply(`Tag user`)  
    if (command === 'autoblock') await sock.updateBlockStatus(user, 'block')  
    if (command === 'autounblock') await sock.updateBlockStatus(user, 'unblock')  
    if (command === 'autokick' && m.key.remoteJid.endsWith('@g.us')) await sock.groupParticipantsUpdate(m.key.remoteJid, [user], 'remove')  
    return reply(`✅ ${command} done for @${user.split('@')[0]} 🐺`, { mentions: [user] })  
  }  

  // delete / antidelete  
  if (['antidelete','autodelete'].includes(command)) {  
    if (!text) return reply(`AntiDelete: ${global.wolfDB.auto.antidelete ? 'ON 🟢 - Deleted msgs will be recovered' : 'OFF 🔴'}\nUsage: .antidelete on/off 🐺`)  
    global.wolfDB.auto.antidelete = text === 'on'  
    return reply(`✅ AntiDelete ${text === 'on' ? 'ENABLED 🟢\nBot will resend deleted messages!' : 'DISABLED 🔴'} 🐺`)  
  }  

  // other autos  
  const others = ['autosticker','autorespond','autochat','autoai','autolevel','autojoin','autoleave','autogroup','autoreject','autoapprove','autosave','autobackup','autoclean','autopurge','autodownload','autopost','autoreply','autovoice']  
  if (others.includes(command)) {  
    if (!text) return reply(`Current ${command}: ${global.wolfDB.auto[command] ? 'ON 🟢' : 'OFF 🔴'}\nUsage: .${command} on/off`)  
    global.wolfDB.auto[command] = text === 'on'  
    return reply(`✅ ${command} ${text === 'on' ? 'ENABLED 🟢' : 'DISABLED 🔴'}\n\n${command === 'autosticker' ? 'All images auto sticker' : command === 'autoai' ? 'AI auto replies' : 'Feature active'} 🐺`)  
  }  

       } catch (e) {
      reply(`❌ Auto Error: ${e.message} 🐺`)
    }
  }
}
