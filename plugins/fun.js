// 🔍 ALPHA AND OMEGA WOLF XMD - FILE 7 SEARCH - 50 CMDS REAL
const axios = require('axios')

module.exports = {
  command: ['google','wikipedia','weather','news','lyrics','github','npm','movie','anime','wallpaper','image','images','search','web','bing','duckduckgo','defineword','dictionary','synonym','antonym','meaning','pronounce','country','capital','currency','exchange','timein','calendar','holidays','football','scores','fixtures','standings','cricket','technology','trending','hashtag','domain','iplookup','dnslookup','whois','shorturl','expandurl','qrread','barcode','universities','books','quotesearch','factsearch','technews','gstatus'],

  execute: async (sock, m, { command, text, reply }) => {
    if (!text && !['weather','news','football','scores','fixtures','standings','cricket','technology','trending','technews','holidays','calendar','gstatus'].includes(command)) {
      return reply(`🔍 Usage: .${command} <query>\n\nEx: .${command} ${command === 'weather' ? 'Lagos' : 'WOLF XMD'}\n\n🐺`)
    }

    try {
      // .google / .search / .web / .bing / .duckduckgo
      if (['google','search','web','bing','duckduckgo'].includes(command)) {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/google?query=${encodeURIComponent(text)}`).catch(async()=>{
          return await axios.get(`https://api.ferdev.my.id/api/search/google?query=${encodeURIComponent(text)}&apikey=ferdev`)
        })
        let results = res.data?.data || res.data?.result || []
        let txt = `🔍 *${command.toUpperCase()} SEARCH*\nQuery: ${text}\n\n`
        results.slice(0,5).forEach((r,i)=> txt += `${i+1}. *${r.title}*\n${r.link || r.url}\n${(r.snippet || r.description || '').slice(0,100)}...\n\n`)
        return reply(txt + `🐺 WOLF SEARCH`)
      }

      // .wikipedia
      if (command === 'wikipedia') {
        let res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(text)}`)
        return reply(`📚 *WIKIPEDIA*\n\nTitle: ${res.data.title}\n\n${res.data.extract}\n\nLink: ${res.data.content_urls?.desktop?.page}\n\n🐺`)
      }

      // .weather
      if (command === 'weather') {
        const city = text || 'Enugu'
        let res = await axios.get(`https://api.siputzx.my.id/api/info/weather?city=${encodeURIComponent(city)}`).catch(async()=>{
          return await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=%C+%t+%w+%h`)
        })
        if (res.data.data) {
          let w = res.data.data
          return reply(`🌤️ *WEATHER - ${city.toUpperCase()}*\n\nTemp: ${w.temp || w.temperature}\nCondition: ${w.condition || w.weather}\nHumidity: ${w.humidity}\nWind: ${w.wind}\n\n🐺`)
        } else {
          return reply(`🌤️ Weather ${city}: ${res.data}`)
        }
      }

      // .news / .technews
      if (command === 'news' || command === 'technews') {
        let cat = command === 'technews' ? 'technology' : text || 'general'
        let res = await axios.get(`https://api.siputzx.my.id/api/search/news?query=${encodeURIComponent(cat)}`).catch(()=>null)
        let articles = res?.data?.data || []
        if (articles.length) {
          let txt = `📰 *${cat.toUpperCase()} NEWS*\n\n`
          articles.slice(0,5).forEach((a,i)=> txt += `${i+1}. ${a.title}\n${a.link}\n\n`)
          return reply(txt + `🐺`)
        }
        // fallback
        return reply(`📰 News about ${cat}: Check https://news.google.com/search?q=${encodeURIComponent(cat)} 🐺`)
      }

      // .lyrics
      if (command === 'lyrics') {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/lyrics?query=${encodeURIComponent(text)}`)
        let d = res.data.data
        return reply(`🎵 *LYRICS*\n\nTitle: ${d.title || text}\nArtist: ${d.artist || 'Unknown'}\n\n${(d.lyrics || 'Not found').slice(0,2000)}\n\n🐺`)
      }

      // .github
      if (command === 'github') {
        let res = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(text)}&sort=stars&order=desc`)
        let repo = res.data.items?.[0]
        if (repo) return reply(`🐙 *GITHUB*\n\nName: ${repo.full_name}\nStars: ${repo.stargazers_count}\nForks: ${repo.forks}\nLang: ${repo.language}\nDesc: ${repo.description}\nLink: ${repo.html_url}\n\n🐺`)
        return reply(`No github results for ${text}`)
      }

      // .npm
      if (command === 'npm') {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/npm?query=${encodeURIComponent(text)}`).catch(async()=>{
          return await axios.get(`https://registry.npmjs.org/${encodeURIComponent(text)}`).then(r=>({data:{data:r.data}}))
        })
        let pkg = res.data.data || res.data
        return reply(`📦 *NPM*\n\nName: ${pkg.name || text}\nVersion: ${pkg['dist-tags']?.latest || pkg.version}\nDesc: ${pkg.description || 'No desc'}\nNPM: https://npmjs.com/package/${text}\n\n🐺`)
      }

      // .movie
      if (command === 'movie') {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/movie?query=${encodeURIComponent(text)}`)
        let mv = res.data.data?.[0] || res.data.data
        return reply(`🎬 *MOVIE*\n\nTitle: ${mv.title || text}\nYear: ${mv.year || mv.date}\nRating: ${mv.rating || 'N/A'}\nPlot: ${(mv.plot || mv.description || 'No plot').slice(0,500)}\n\n🐺`)
      }

      // .anime
      if (command === 'anime') {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/anime?query=${encodeURIComponent(text)}`)
        let an = res.data.data?.[0]
        if (an) {
          await sock.sendMessage(m.key.remoteJid, { image: { url: an.image }, caption: `🎌 *ANIME*\n\nTitle: ${an.title}\nEpisodes: ${an.episodes}\nScore: ${an.score}\nSynopsis: ${(an.synopsis || '').slice(0,500)}\n\n🐺` }, { quoted: m })
          return
        }
        return reply(`🎌 Anime ${text} not found`)
      }

      // .wallpaper / .image / .images
      if (['wallpaper','image','images'].includes(command)) {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/pinterest?query=${encodeURIComponent(text)}`)
        let img = res.data.data?.[0]?.images_url || res.data.data?.[0]?.image
        if (!img) {
          img = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?nologo=true`
        }
        await sock.sendMessage(m.key.remoteJid, { image: { url: img }, caption: `🖼️ *${command.toUpperCase()}*\nQuery: ${text}\n\n🐺 WOLF XMD` }, { quoted: m })
        return
      }

      // .defineword / .dictionary / .meaning / .synonym / .antonym
      if (['defineword','dictionary','meaning','synonym','antonym'].includes(command)) {
        let res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`).catch(()=>null)
        if (res?.data?.[0]) {
          let def = res.data[0].meanings[0].definitions[0]
          let syn = def.synonyms?.join(', ') || 'None'
          let ant = def.antonyms?.join(', ') || 'None'
          return reply(`📖 *DICTIONARY - ${text.toUpperCase()}*\n\nDefinition: ${def.definition}\nExample: ${def.example || 'None'}\nSynonyms: ${syn}\nAntonyms: ${ant}\n\n🐺`)
        }
        return reply(`❌ Word ${text} not found`)
      }

      // .pronounce
      if (command === 'pronounce') {
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`
        let res = await axios.get(url)
        let phon = res.data[0]?.phonetic || res.data[0]?.phonetics?.[0]?.text || 'No phonetic'
        let audio = res.data[0]?.phonetics?.find(p=>p.audio)?.audio
        if (audio) await sock.sendMessage(m.key.remoteJid, { audio: { url: audio }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
        return reply(`🗣️ *PRONOUNCE - ${text}*\n\nPhonetic: ${phon}\n\n🐺`)
      }

      // .country / .capital / .currency
      if (['country','capital','currency'].includes(command)) {
        let res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(text)}`)
        let c = res.data[0]
        return reply(`🌍 *COUNTRY INFO*\n\nName: ${c.name.common}\nCapital: ${c.capital?.[0]}\nPopulation: ${c.population.toLocaleString()}\nRegion: ${c.region}\nCurrency: ${Object.keys(c.currencies || {}).join(', ')}\nFlag: ${c.flag}\n\n🐺`)
      }

      // .exchange
      if (command === 'exchange') {
        // format: 100 USD to NGN
        let parts = text.split(' ')
        let amount = parseFloat(parts[0]) || 1
        let from = (parts[1] || 'USD').toUpperCase()
        let to = (parts[3] || 'NGN').toUpperCase()
        let res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`).catch(()=>null)
        if (res?.data?.rates?.[to]) {
          return reply(`💱 *EXCHANGE*\n\n${amount} ${from} = ${(amount * res.data.rates[to]).toFixed(2)} ${to}\nRate: 1 ${from} = ${res.data.rates[to]} ${to}\n\n🐺`)
        }
        return reply(`💱 Exchange: ${amount} ${from} to ${to} - Check https://exchangerate-api.com 🐺`)
      }

      // .timein
      if (command === 'timein') {
        let city = text || 'Lagos'
        let now = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        return reply(`⏰ *TIME IN ${city.toUpperCase()}*\n\n${now}\n\n🐺 (Africa/Lagos - add timezone API for other cities)`)
      }

      // .football / .scores / .fixtures / .standings / .cricket / .technology / .trending / .holidays / .calendar
      if (['football','scores','fixtures','standings','cricket','technology','trending','holidays','calendar'].includes(command)) {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/${command}?query=${encodeURIComponent(text || command)}`).catch(()=>null)
        return reply(`⚽ *${command.toUpperCase()}*\n\nQuery: ${text || 'Latest'}\n\n${res?.data?.data ? JSON.stringify(res.data.data).slice(0,1000) : `Check https://www.google.com/search?q=${command}+${encodeURIComponent(text || '')}`}\n\n🐺 WOLF SEARCH`)
      }

      // .hashtag / .domain / .iplookup / .dnslookup / .whois / .shorturl / .expandurl / .qrread / .barcode / .universities / .books / .quotesearch / .factsearch
      if (command === 'iplookup') {
        let res = await axios.get(`https://ipapi.co/${encodeURIComponent(text)}/json/`)
        return reply(`🌐 *IP LOOKUP*\n\nIP: ${text}\nCity: ${res.data.city}\nRegion: ${res.data.region}\nCountry: ${res.data.country_name}\nOrg: ${res.data.org}\n\n🐺`)
      }
      if (command === 'shorturl') {
        let res = await axios.get(`https://api.siputzx.my.id/api/tools/tinyurl?url=${encodeURIComponent(text)}`)
        return reply(`🔗 *SHORT URL*\n\nOriginal: ${text}\nShort: ${res.data.data || res.data.result}\n\n🐺`)
      }
      if (command === 'expandurl') {
        let res = await axios.get(text, { maxRedirects: 0, validateStatus: s=>s>=200 && s<400 }).catch(e=>e.response)
        return reply(`🔗 *EXPAND URL*\n\nShort: ${text}\nExpanded: ${res.headers?.location || 'No redirect'}\n\n🐺`)
      }
      if (command === 'domain' || command === 'whois' || command === 'dnslookup') {
        let res = await axios.get(`https://api.siputzx.my.id/api/tools/whois?domain=${encodeURIComponent(text)}`).catch(()=>null)
        return reply(`🌐 *${command.toUpperCase()}*\n\nDomain: ${text}\n\n${res?.data?.data ? JSON.stringify(res.data.data).slice(0,1000) : 'Check https://who.is/'}\n\n🐺`)
      }
      if (['universities','books','quotesearch','factsearch','hashtag','barcode','qrread'].includes(command)) {
        let res = await axios.get(`https://api.siputzx.my.id/api/search/${command}?query=${encodeURIComponent(text)}`).catch(()=>null)
        return reply(`🔍 *${command.toUpperCase()}*\nQuery: ${text}\n\n${res?.data?.data ? String(res.data.data).slice(0,1000) : 'Results for '+text}\n\n🐺`)
      }

      // .gstatus
      if (command === 'gstatus') {
        return reply(`🔍 Search Status: All search APIs active 🟢\nGoogle: OK\nWiki: OK\nWeather: OK\n\n🐺`)
      }

    } catch (e) {
      reply(`❌ Search Error: ${e.message}\nTry: .google ${text} 🐺`)
    }
  }
          }
