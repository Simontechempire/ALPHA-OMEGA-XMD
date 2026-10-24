// 🤖 ALPHA AND OMEGA WOLF XMD - FILE 2 AI - 50 CMDS REAL - TYPE 2 DASHBOARD EDITION
const axios = require('axios')
const settings = require('../settings')

// TYPE 2: Gemini with API KEY from ENV
let geminiModel = null
function getGemini() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || settings.geminiKey || settings.GEMINI_API_KEY
    if (!apiKey || apiKey.includes('your_') || apiKey.length < 10) return null
    if (!geminiModel) {
      const { GoogleGenerativeAI } = require('@google/generative-ai')
      const genAI = new GoogleGenerativeAI(apiKey)
      geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    }
    return geminiModel
  } catch (e) {
    return null
  }
}

async function askGemini(prompt) {
  const model = getGemini()
  if (!model) return null
  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (e) {
    console.log("Gemini error: " + e.message)
    return null
  }
}

async function fallbackAI(prompt) {
  // Fallback APIs if Gemini fails or no key
  const apis = [
    `https://api.siputzx.my.id/api/ai/gpt3?text=${encodeURIComponent(prompt)}`,
    `https://api.ferdev.my.id/api/ai/chatgpt?text=${encodeURIComponent(prompt)}&apikey=ferdev`,
  ]
  for (let url of apis) {
    try {
      let res = await axios.get(url, { timeout: 15000 })
      let ans = res.data?.data || res.data?.result || res.data?.answer
      if (ans) return ans
    } catch {}
  }
  return "❌ AI services busy. Set GEMINI_API_KEY in Render Dashboard ENV for best results 🐺"
}

module.exports = {
  command: ['ai','gpt','chatgpt','gemini','llama','deepseek','claude','copilot','perplexity','ask','imagine','translate','summarize','define','explain','rewrite','grammar','paraphrase','essay','story','poem','code','debug','javascript','python','html','css','nodejs','sql','regex','math','solve','homework','quiz','tutor','languageai','emailai','caption','bioai','businessai','marketingai','resumeai','interviewai','ideas','plan','recipeai','travelai','sentiment','aiclear'],

  execute: async (sock, m, { command, text, reply, prefix }) => {

    if (command === 'aiclear') {
      global.wolfAIHistory = {}
      return reply(`🧹 *AI HISTORY CLEARED TYPE 2*\n\nAll AI chats cleared for ${m.key.remoteJid}\nGemini Key: ${process.env.GEMINI_API_KEY ? 'SET ✓' : 'MISSING - Set in Dashboard ENV'}\n\n🐺 TYPE 2`)
    }

    if (!text) return reply(`🤖 *AI TYPE 2 - GEMINI ENV*\n\nUsage: ${prefix}${command} <query>\nEx: ${prefix}${command} what is WOLF XMD?\n\nGemini: ${process.env.GEMINI_API_KEY ? 'ON ✓' : 'OFF - Set GEMINI_API_KEY in Render ENV'}\nFallback: ON\n\n🐺 TYPE 2`)

    try {
      const promptBase = text
      let answer = null

      // TYPE 2: Try Gemini first if API key exists
      const gemini = getGemini()

      // Define prompts per command
      const prompts = {
        ai: promptBase,
        gpt: promptBase,
        chatgpt: promptBase,
        gemini: promptBase,
        llama: `You are Llama. ${promptBase}`,
        deepseek: `You are DeepSeek. ${promptBase}`,
        claude: `You are Claude. ${promptBase}`,
        copilot: `You are Copilot, coding assistant. ${promptBase}`,
        perplexity: promptBase,
        ask: promptBase,
        summarize: `Summarize this in short: ${promptBase}`,
        define: `Define: ${promptBase}`,
        explain: `Explain in simple terms: ${promptBase}`,
        rewrite: `Rewrite this: ${promptBase}`,
        grammar: `Correct grammar: ${promptBase}`,
        paraphrase: `Paraphrase: ${promptBase}`,
        essay: `Write a 300 word essay about: ${promptBase}`,
        story: `Write a short story about: ${promptBase}`,
        poem: `Write a poem about: ${promptBase}`,
        code: `Write code for: ${promptBase}. Provide only code with comments.`,
        debug: `Debug this code and fix: ${promptBase}`,
        javascript: `Write JavaScript code for: ${promptBase}`,
        python: `Write Python code for: ${promptBase}`,
        html: `Write HTML code for: ${promptBase}`,
        css: `Write CSS code for: ${promptBase}`,
        nodejs: `Write Node.js code for: ${promptBase}`,
        sql: `Write SQL query for: ${promptBase}`,
        regex: `Write regex for: ${promptBase}`,
        math: `Solve math step by step: ${promptBase}`,
        solve: `Solve math step by step: ${promptBase}`,
        homework: `Help with homework: ${promptBase}`,
        quiz: `Create a quiz about: ${promptBase} with 4 options and answer`,
        tutor: `Act as tutor and teach me: ${promptBase}`,
        languageai: `Teach me language: ${promptBase}`,
        emailai: `Write professional email about: ${promptBase}`,
        caption: `Write Instagram caption for: ${promptBase} with hashtags`,
        bioai: `Write bio for: ${promptBase}`,
        businessai: `You are business expert. Help with: ${promptBase}`,
        marketingai: `You are marketing expert. Help with: ${promptBase}`,
        resumeai: `You are resume expert. Help with: ${promptBase}`,
        interviewai: `You are interview coach. Help with: ${promptBase}`,
        ideas: `Give business/creative ideas for: ${promptBase}`,
        plan: `Create a plan for: ${promptBase}`,
        recipeai: `Give recipe for: ${promptBase}`,
        travelai: `You are travel guide for: ${promptBase}`,
        sentiment: `Analyze sentiment of: ${promptBase}`
      }

      let finalPrompt = prompts[command] || promptBase

      // .imagine - image generation - no Gemini needed
      if (command === 'imagine') {
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?nologo=true&seed=${Math.floor(Math.random()*9999)}`
        await sock.sendMessage(m.key.remoteJid, { image: { url }, caption: `🎨 *IMAGINE TYPE 2*\n\nPrompt: ${text}\n\n🐺 WOLF XMD TYPE 2 - Gemini: ${gemini ? 'ON' : 'OFF'}` }, { quoted: m })
        return
      }

      // .translate - special
      if (command === 'translate') {
        let lang = 'fr'
        let query = text
        if (text.includes('|')) { const parts = text.split('|'); query = parts[0].trim(); lang = parts[1].trim() }
        if (gemini) {
          let tr = await askGemini(`Translate to ${lang}: ${query}. Only give translation.`)
          if (tr) return reply(`🌐 *TRANSLATE TYPE 2 (GEMINI)*\n\nFrom: ${query}\nTo (${lang}): ${tr}\n\n🐺 TYPE 2`)
        }
        let res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=en|${lang}`).catch(()=>null)
        let translated = res?.data?.responseData?.translatedText || await fallbackAI(`Translate to ${lang}: ${query}`)
        return reply(`🌐 *TRANSLATE TYPE 2*\n\nFrom: ${query}\nTo (${lang}): ${translated}\n\n🐺 TYPE 2`)
      }

      // Try Gemini first
      if (gemini) {
        answer = await askGemini(finalPrompt)
      }
      // Fallback
      if (!answer) {
        answer = await fallbackAI(finalPrompt)
      }

      // Formatting per command
      const titles = {
        ai: '🤖 WOLF AI TYPE 2', gpt: '🧠 GPT TYPE 2', chatgpt: '💬 CHATGPT TYPE 2', gemini: '✨ GEMINI TYPE 2 - ENV',
        llama: '🦙 LLAMA TYPE 2', deepseek: '🔍 DEEPSEEK TYPE 2', claude: '🤖 CLAUDE TYPE 2',
        copilot: '💻 COPILOT TYPE 2', perplexity: '🔮 PERPLEXITY TYPE 2', ask: '❓ ASK TYPE 2',
        summarize: '📝 SUMMARIZE TYPE 2', define: `📖 DEFINE ${text}`, explain: '💡 EXPLAIN TYPE 2',
        rewrite: '✍️ REWRITE TYPE 2', grammar: '📝 GRAMMAR FIX TYPE 2', paraphrase: '🔄 PARAPHRASE TYPE 2',
        essay: `📄 ESSAY - ${text}`, story: '📖 STORY TYPE 2', poem: '📝 POEM TYPE 2',
        code: '💻 CODE TYPE 2', debug: '🐛 DEBUG TYPE 2', javascript: '📜 JAVASCRIPT TYPE 2',
        python: '🐍 PYTHON TYPE 2', html: '🌐 HTML TYPE 2', css: '🎨 CSS TYPE 2',
        nodejs: '🟢 NODEJS TYPE 2', sql: '🗄️ SQL TYPE 2', regex: '🔍 REGEX TYPE 2',
        math: '🧮 MATH SOLVE TYPE 2', solve: '🧮 SOLVE TYPE 2', homework: '📚 HOMEWORK TYPE 2',
        quiz: '❓ QUIZ TYPE 2', tutor: '👨‍🏫 TUTOR TYPE 2', languageai: '🗣️ LANGUAGE AI TYPE 2',
        emailai: '📧 EMAIL AI TYPE 2', caption: '📸 CAPTION TYPE 2', bioai: '👤 BIO AI TYPE 2',
        businessai: '💼 BUSINESS AI TYPE 2', marketingai: '📈 MARKETING AI TYPE 2', resumeai: '📄 RESUME AI TYPE 2',
        interviewai: '💼 INTERVIEW AI TYPE 2', ideas: '💡 IDEAS TYPE 2', plan: '📋 PLAN TYPE 2',
        recipeai: '🍳 RECIPE AI TYPE 2', travelai: '✈️ TRAVEL AI TYPE 2', sentiment: '😊 SENTIMENT TYPE 2'
      }

      const title = titles[command] || `🤖 ${command.toUpperCase()} TYPE 2`

      if (['code','javascript','python','html','css','nodejs','sql'].includes(command)) {
        const lang = command === 'code' ? '' : command
        return reply(`${title}\n\nRequest: ${text}\n\n\`\`\`${lang}\n${answer}\n\`\`\`\n\n🐺 TYPE 2 | Gemini: ${gemini ? 'ON ✓' : 'Fallback'}`)
      }

      return reply(`${title}\n\nQ: ${text}\n\nA: ${answer}\n\n🐺 ALPHA AND OMEGA TYPE 2 | ENV: ${gemini ? 'GEMINI ✓' : 'FALLBACK'}`)

    } catch (e) {
      console.log(`AI TYPE 2 Error ${command}: ${e.message}`)
      reply(`❌ AI TYPE 2 Error: ${e.message}\nSet GEMINI_API_KEY in Render Dashboard ENV for stable AI! 🐺`)
    }
  }
      }
