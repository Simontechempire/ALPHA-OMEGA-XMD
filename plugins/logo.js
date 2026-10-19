// 🎨 ALPHA AND OMEGA WOLF XMD - FILE 12 LOGO - 50 CMDS REAL
const axios = require('axios')

module.exports = {
  command: ['logo1','logo2','logo3','logo4','logo5','logo6','logo7','logo8','logo9','logo10','logofire','logowolf','logogold','logosilver','logoneon','logoblood','logolava','logoice','logogalaxy','logothunder','logopubg','logoff','logoanime','logomarvel','logodc','logogaming','logo3d','logoname','logotext','textpro1','textpro2','textpro3','textpro4','textpro5','textpro6','textpro7','textpro8','textpro9','textpro10','ephoto1','ephoto2','ephoto3','ephoto4','ephoto5','banner','thumbnail','ytthumb','cover','gaminglogo','wolfpack'],

  execute: async (sock, m, { command, text, reply }) => {
    if (!text) return reply(`🎨 Usage: .${command} <text>\n\nEx: .${command} WOLF XMD\n\n🐺 LOGO MAKER`)

    try {
      // Base URL for textpro/ephoto APIs
      const apis = {
        logo1: `https://api.siputzx.my.id/api/textpro/blackpink?text=${encodeURIComponent(text)}`,
        logo2: `https://api.siputzx.my.id/api/textpro/neon?text=${encodeURIComponent(text)}`,
        logo3: `https://api.siputzx.my.id/api/textpro/glitch?text=${encodeURIComponent(text)}`,
        logo4: `https://api.siputzx.my.id/api/textpro/bear?text=${encodeURIComponent(text)}`,
        logo5: `https://api.siputzx.my.id/api/textpro/futuristic?text=${encodeURIComponent(text)}`,
        logo6: `https://api.siputzx.my.id/api/textpro/3d?text=${encodeURIComponent(text)}`,
        logo7: `https://api.siputzx.my.id/api/textpro/fire?text=${encodeURIComponent(text)}`,
        logo8: `https://api.siputzx.my.id/api/textpro/matrix?text=${encodeURIComponent(text)}`,
        logo9: `https://api.siputzx.my.id/api/textpro/metallic?text=${encodeURIComponent(text)}`,
        logo10: `https://api.siputzx.my.id/api/textpro/horror?text=${encodeURIComponent(text)}`,
        logofire: `https://api.siputzx.my.id/api/textpro/fire?text=${encodeURIComponent(text)}`,
        logowolf: `https://api.siputzx.my.id/api/textpro/wolf?text=${encodeURIComponent(text)}`,
        logogold: `https://api.siputzx.my.id/api/textpro/golden?text=${encodeURIComponent(text)}`,
        logosilver: `https://api.siputzx.my.id/api/textpro/silver?text=${encodeURIComponent(text)}`,
        logoneon: `https://api.siputzx.my.id/api/textpro/neon?text=${encodeURIComponent(text)}`,
        logoblood: `https://api.siputzx.my.id/api/textpro/blood?text=${encodeURIComponent(text)}`,
        logolava: `https://api.siputzx.my.id/api/textpro/lava?text=${encodeURIComponent(text)}`,
        logoice: `https://api.siputzx.my.id/api/textpro/ice?text=${encodeURIComponent(text)}`,
        logogalaxy: `https://api.siputzx.my.id/api/textpro/galaxy?text=${encodeURIComponent(text)}`,
        logothunder: `https://api.siputzx.my.id/api/textpro/thunder?text=${encodeURIComponent(text)}`,
        logopubg: `https://api.siputzx.my.id/api/textpro/pubg?text=${encodeURIComponent(text)}`,
        logoff: `https://api.siputzx.my.id/api/textpro/freefire?text=${encodeURIComponent(text)}`,
        logoanime: `https://api.siputzx.my.id/api/textpro/anime?text=${encodeURIComponent(text)}`,
        logomarvel: `https://api.siputzx.my.id/api/textpro/marvel?text=${encodeURIComponent(text)}`,
        logodc: `https://api.siputzx.my.id/api/textpro/dc?text=${encodeURIComponent(text)}`,
        logogaming: `https://api.siputzx.my.id/api/textpro/gaming?text=${encodeURIComponent(text)}`,
        logo3d: `https://api.siputzx.my.id/api/textpro/3d?text=${encodeURIComponent(text)}`,
        logoname: `https://api.siputzx.my.id/api/textpro/3d?text=${encodeURIComponent(text)}`,
        logotext: `https://api.siputzx.my.id/api/textpro/neon?text=${encodeURIComponent(text)}`,
        textpro1: `https://api.siputzx.my.id/api/textpro/blackpink?text=${encodeURIComponent(text)}`,
        textpro2: `https://api.siputzx.my.id/api/textpro/neon?text=${encodeURIComponent(text)}`,
        textpro3: `https://api.siputzx.my.id/api/textpro/3d?text=${encodeURIComponent(text)}`,
        textpro4: `https://api.siputzx.my.id/api/textpro/bear?text=${encodeURIComponent(text)}`,
        textpro5: `https://api.siputzx.my.id/api/textpro/blood?text=${encodeURIComponent(text)}`,
        textpro6: `https://api.siputzx.my.id/api/textpro/fire?text=${encodeURIComponent(text)}`,
        textpro7: `https://api.siputzx.my.id/api/textpro/galaxy?text=${encodeURIComponent(text)}`,
        textpro8: `https://api.siputzx.my.id/api/textpro/glitch?text=${encodeURIComponent(text)}`,
        textpro9: `https://api.siputzx.my.id/api/textpro/golden?text=${encodeURIComponent(text)}`,
        textpro10: `https://api.siputzx.my.id/api/textpro/matrix?text=${encodeURIComponent(text)}`,
        ephoto1: `https://api.siputzx.my.id/api/ephoto/1?text=${encodeURIComponent(text)}`,
        ephoto2: `https://api.siputzx.my.id/api/ephoto/2?text=${encodeURIComponent(text)}`,
        ephoto3: `https://api.siputzx.my.id/api/ephoto/3?text=${encodeURIComponent(text)}`,
        ephoto4: `https://api.siputzx.my.id/api/ephoto/4?text=${encodeURIComponent(text)}`,
        ephoto5: `https://api.siputzx.my.id/api/ephoto/5?text=${encodeURIComponent(text)}`,
        banner: `https://api.siputzx.my.id/api/textpro/3d?text=${encodeURIComponent(text)}`,
        thumbnail: `https://api.siputzx.my.id/api/textpro/thumbnail?text=${encodeURIComponent(text)}`,
        ytthumb: `https://api.siputzx.my.id/api/textpro/youtube?text=${encodeURIComponent(text)}`,
        cover: `https://api.siputzx.my.id/api/textpro/cover?text=${encodeURIComponent(text)}`,
        gaminglogo: `https://api.siputzx.my.id/api/textpro/gaming?text=${encodeURIComponent(text)}`,
        wolfpack: `https://api.siputzx.my.id/api/textpro/wolf?text=${encodeURIComponent(text)}`,
      }

      let apiUrl = apis[command]
      if (!apiUrl) apiUrl = `https://api.siputzx.my.id/api/textpro/3d?text=${encodeURIComponent(text)}`

      // Try primary API
      try {
        let res = await axios.get(apiUrl, { responseType: 'arraybuffer' }).then(r=>r.data).catch(async()=>{
          // Fallback 1: ferdev
          let url2 = `https://api.ferdev.my.id/maker/${command}?text=${encodeURIComponent(text)}&apikey=ferdev`
          return await axios.get(url2, { responseType: 'arraybuffer' }).then(r=>r.data)
        })
        // Check if buffer is image
        if (res && res.length > 1000) {
          await sock.sendMessage(m.key.remoteJid, { image: Buffer.from(res), caption: `🎨 *${command.toUpperCase()}*\nText: ${text}\n\n🐺 ALPHA AND OMEGA WOLF XMD - LOGO MAKER` }, { quoted: m })
          return
        }
      } catch {}

      // Ultimate fallback - pollinations text logo
      let fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(command)} logo with text "${encodeURIComponent(text)}" 3d gaming style?width=800&height=400&nologo=true`
      await sock.sendMessage(m.key.remoteJid, { image: { url: fallbackUrl }, caption: `🎨 *${command.toUpperCase()} - LOGO*\nText: ${text}\nStyle: ${command}\n\n🐺 WOLF XMD LOGO MAKER` }, { quoted: m })

    } catch (e) {
      reply(`❌ Logo Error: ${e.message}\nTry .logo1 WOLF 🐺`)
    }
  }
}
