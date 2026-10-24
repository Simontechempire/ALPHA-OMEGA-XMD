// 🤖 ALPHA AND OMEGA WOLF XMD - FILE 2 AI - 50 CMDS REAL
const axios = require('axios')

module.exports = {
  command: ['ai','gpt','chatgpt','gemini','llama','deepseek','claude','copilot','perplexity','ask','imagine','translate','summarize','define','explain','rewrite','grammar','paraphrase','essay','story','poem','code','debug','javascript','python','html','css','nodejs','sql','regex','math','solve','homework','quiz','tutor','languageai','emailai','caption','bioai','businessai','marketingai','resumeai','interviewai','ideas','plan','recipeai','travelai','sentiment','aiclear'],

  execute: async (sock, m, { command, text, reply }) => {

    if (command === 'aiclear') {
      global.wolfAIHistory = {}
      return reply(`🧹 *AI HISTORY CLEARED*\n\nAll AI chats cleared for ${m.key.remoteJid}\n\n🐺`)
    }

    if (!text) return reply(`🤖 Usage: .${command} <query>\n\nEx: .${command} what is WOLF XMD?\n\n🐺`)

    try {
      // .ai
      if (command === 'ai') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=${encodeURIComponent(text)}`)
        let ans = res.data.data || res.data.result
        return reply(`🤖 *WOLF AI*\n\nQ: ${text}\n\nA: ${ans}\n\n🐺 ALPHA AND OMEGA`)
      }

      // .gpt
      if (command === 'gpt') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=${encodeURIComponent(text)}`)
        return reply(`🧠 *GPT*\n\n${res.data.data}\n\n🐺`)
      }

      // .chatgpt
      if (command === 'chatgpt') {
        let res = await axios.get(`https://api.ferdev.my.id/api/ai/chatgpt?text=${encodeURIComponent(text)}&apikey=ferdev`)
        return reply(`💬 *CHATGPT*\n\n${res.data.data || res.data.result}\n\n🐺`)
      }

      // .gemini
      if (command === 'gemini') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`)
        return reply(`✨ *GEMINI*\n\n${res.data.data || res.data.result}\n\n🐺`)
      }

      // .llama
      if (command === 'llama') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/llama?text=${encodeURIComponent(text)}`)
        return reply(`🦙 *LLAMA*\n\n${res.data.data || 'Llama response'}\n\n🐺`)
      }

      // .deepseek
      if (command === 'deepseek') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/deepseek?text=${encodeURIComponent(text)}`)
        return reply(`🔍 *DEEPSEEK*\n\n${res.data.data || res.data.result}\n\n🐺`)
      }

      // .claude
      if (command === 'claude') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/claude?text=${encodeURIComponent(text)}`)
        return reply(`🤖 *CLAUDE*\n\n${res.data.data || res.data.result}\n\n🐺`)
      }

      // .copilot
      if (command === 'copilot') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=You are Copilot. ${encodeURIComponent(text)}`)
        return reply(`💻 *COPILOT*\n\n${res.data.data}\n\n🐺`)
      }

      // .perplexity
      if (command === 'perplexity') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/perplexity?text=${encodeURIComponent(text)}`)
        return reply(`🔮 *PERPLEXITY*\n\n${res.data.data || res.data.result}\n\n🐺`)
      }

      // .ask
      if (command === 'ask') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=${encodeURIComponent(text)}`)
        return reply(`❓ *ASK*\n\nQ: ${text}\nA: ${res.data.data}\n\n🐺`)
      }

      // .imagine
      if (command === 'imagine') {
        let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?nologo=true`
        await sock.sendMessage(m.key.remoteJid, { image: { url }, caption: `🎨 *IMAGINE*\n\nPrompt: ${text}\n\n🐺 WOLF XMD` }, { quoted: m })
        return
      }

      // .translate
      if (command === 'translate') {
        // format: text | lang or auto to french
        let lang = 'fr'
        let query = text
        if (text.includes('|')) { const parts = text.split('|'); query = parts[0].trim(); lang = parts[1].trim() }
        let res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=en|${lang}`)
        return reply(`🌐 *TRANSLATE*\n\nFrom: ${query}\nTo (${lang}): ${res.data.responseData.translatedText}\n\n🐺`)
      }

      // .summarize
      if (command === 'summarize') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Summarize this in short: ${encodeURIComponent(text)}`)
        return reply(`📝 *SUMMARIZE*\n\n${res.data.data}\n\n🐺`)
      }

      // .define
      if (command === 'define') {
        let res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`).catch(() => null)
        if (res) return reply(`📖 *DEFINE ${text}*\n\n${res.data[0].meanings[0].definitions[0].definition}\n\nExample: ${res.data[0].meanings[0].definitions[0].example || 'None'}\n\n🐺`)
        let ai = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Define ${encodeURIComponent(text)}`)
        return reply(`📖 *DEFINE*\n\n${ai.data.data}\n\n🐺`)
      }

      // .explain
      if (command === 'explain') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Explain in simple terms: ${encodeURIComponent(text)}`)
        return reply(`💡 *EXPLAIN*\n\n${res.data.data}\n\n🐺`)
      }

      // .rewrite
      if (command === 'rewrite') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Rewrite this: ${encodeURIComponent(text)}`)
        return reply(`✍️ *REWRITE*\n\n${res.data.data}\n\n🐺`)
      }

      // .grammar
      if (command === 'grammar') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Correct grammar: ${encodeURIComponent(text)}`)
        return reply(`📝 *GRAMMAR FIX*\n\nOriginal: ${text}\nFixed: ${res.data.data}\n\n🐺`)
      }

      // .paraphrase
      if (command === 'paraphrase') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Paraphrase: ${encodeURIComponent(text)}`)
        return reply(`🔄 *PARAPHRASE*\n\n${res.data.data}\n\n🐺`)
      }

      // .essay
      if (command === 'essay') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write a 300 word essay about: ${encodeURIComponent(text)}`)
        return reply(`📄 *ESSAY*\n\nTopic: ${text}\n\n${res.data.data}\n\n🐺`)
      }

      // .story
      if (command === 'story') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write a short story about: ${encodeURIComponent(text)}`)
        return reply(`📖 *STORY*\n\n${res.data.data}\n\n🐺`)
      }

      // .poem
      if (command === 'poem') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write a poem about: ${encodeURIComponent(text)}`)
        return reply(`📝 *POEM*\n\n${res.data.data}\n\n🐺`)
      }

      // .code
      if (command === 'code') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write code for: ${encodeURIComponent(text)}. Provide only code with comments.`)
        return reply(`💻 *CODE*\n\nRequest: ${text}\n\n\`\`\`\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .debug
      if (command === 'debug') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Debug this code and fix: ${encodeURIComponent(text)}`)
        return reply(`🐛 *DEBUG*\n\n${res.data.data}\n\n🐺`)
      }

      // .javascript
      if (command === 'javascript') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write JavaScript code for: ${encodeURIComponent(text)}`)
        return reply(`📜 *JAVASCRIPT*\n\n\`\`\`js\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .python
      if (command === 'python') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write Python code for: ${encodeURIComponent(text)}`)
        return reply(`🐍 *PYTHON*\n\n\`\`\`python\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .html
      if (command === 'html') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write HTML code for: ${encodeURIComponent(text)}`)
        return reply(`🌐 *HTML*\n\n\`\`\`html\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .css
      if (command === 'css') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write CSS code for: ${encodeURIComponent(text)}`)
        return reply(`🎨 *CSS*\n\n\`\`\`css\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .nodejs
      if (command === 'nodejs') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write Node.js code for: ${encodeURIComponent(text)}`)
        return reply(`🟢 *NODEJS*\n\n\`\`\`js\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .sql
      if (command === 'sql') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write SQL query for: ${encodeURIComponent(text)}`)
        return reply(`🗄️ *SQL*\n\n\`\`\`sql\n${res.data.data}\n\`\`\`\n\n🐺`)
      }

      // .regex
      if (command === 'regex') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write regex for: ${encodeURIComponent(text)}`)
        return reply(`🔍 *REGEX*\n\n${res.data.data}\n\n🐺`)
      }

      // .math / .solve
      if (command === 'math' || command === 'solve') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Solve math step by step: ${encodeURIComponent(text)}`)
        return reply(`🧮 *MATH SOLVE*\n\nProblem: ${text}\n\nSolution: ${res.data.data}\n\n🐺`)
      }

      // .homework
      if (command === 'homework') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Help with homework: ${encodeURIComponent(text)}`)
        return reply(`📚 *HOMEWORK*\n\n${res.data.data}\n\n🐺`)
      }

      // .quiz
      if (command === 'quiz') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Create a quiz about: ${encodeURIComponent(text)} with 4 options and answer`)
        return reply(`❓ *QUIZ*\n\n${res.data.data}\n\n🐺`)
      }

      // .tutor
      if (command === 'tutor') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Act as tutor and teach me: ${encodeURIComponent(text)}`)
        return reply(`👨‍🏫 *TUTOR*\n\n${res.data.data}\n\n🐺`)
      }

      // .languageai
      if (command === 'languageai') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Teach me language: ${encodeURIComponent(text)}`)
        return reply(`🗣️ *LANGUAGE AI*\n\n${res.data.data}\n\n🐺`)
      }

      // .emailai
      if (command === 'emailai') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write professional email about: ${encodeURIComponent(text)}`)
        return reply(`📧 *EMAIL AI*\n\n${res.data.data}\n\n🐺`)
      }

      // .caption
      if (command === 'caption') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write Instagram caption for: ${encodeURIComponent(text)} with hashtags`)
        return reply(`📸 *CAPTION*\n\n${res.data.data}\n\n🐺`)
      }

      // .bioai
      if (command === 'bioai') {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=Write bio for: ${encodeURIComponent(text)}`)
        return reply(`👤 *BIO AI*\n\n${res.data.data}\n\n🐺`)
      }

      // .businessai / .marketingai / .resumeai / .interviewai / .ideas / .plan / .recipeai / .travelai / .sentiment
      if (['businessai','marketingai','resumeai','interviewai','ideas','plan','recipeai','travelai','sentiment'].includes(command)) {
        let res = await axios.get(`https://api.siputzx.my.id/api/ai/gpt3?text=You are ${command} expert. Help with: ${encodeURIComponent(text)}`)
        return reply(`💼 *${command.toUpperCase()}*\n\n${res.data.data}\n\n🐺`)
      }

    } catch (e) {
      reply(`❌ AI Error: ${e.message}\nTry again! 🐺`)
    }
  }
          }
