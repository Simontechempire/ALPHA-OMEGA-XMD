// 💰 ALPHA AND OMEGA WOLF XMD - FILE 10 ECONOMY - 50 CMDS REAL - FIXED
module.exports = {
  command: ['balance','bal','daily','work','hunt','fish','mine','rob','steal','beg','gamble','bet','slots','lottery','bank','deposit','withdraw','pay','transfer','leaderboard','lb','top','rich','rank','level','xp','profile','inventory','inv','shop','buy','sell','craft','use','heal','eat','job','jobs','salary','business','invest','stock','crypto','wallet','coin','coins','gems','store','economy','seteconomy','reseteco'],
  execute: async (sock, m, { command, text, reply }) => {
    global.wolfEco = global.wolfEco || { users: {}, shop: [{ id: 'wolf', name: '🐺 WOLF PET', price: 1000 }, { id: 'sword', name: '⚔️ SWORD', price: 500 }, { id: 'shield', name: '🛡️ SHIELD', price: 700 }, { id: 'potion', name: '🧪 POTION', price: 100 }] }
    const userId = m.key.participant || m.key.remoteJid
    if (!global.wolfEco.users[userId]) global.wolfEco.users[userId] = { coins: 1000, gems: 10, bank: 0, xp: 0, level: 1, inventory: [], daily: 0, work: 0 }
    const user = global.wolfEco.users[userId]
    const addXP = (n) => { user.xp += n; if (user.xp >= user.level*1000) { user.level++; user.coins += 500; reply(`🎉 LEVEL UP! Now Lv ${user.level}! +500 coins 🐺`) } }

    try {
      if (['balance','bal','wallet','coin','coins','gems','bank','economy'].includes(command)) {
        return reply(`💰 *WOLF ECONOMY*\n\nUser: @${userId.split('@')[0]}\n💵 Coins: ${user.coins}\n💎 Gems: ${user.gems}\n🏦 Bank: ${user.bank}\n⭐ Lv: ${user.level}\n✨ XP: ${user.xp}/${user.level*1000}\n\n🐺`, { mentions: [userId] })
      }
      if (command === 'daily') {
        const now = Date.now()
        if (now - user.daily < 86400000) {
          const left = Math.ceil((86400000 - (now - user.daily))/3600000)
          return reply(`⏰ Daily claimed! Come back in ${left}h`)
        }
        const reward = 500 + Math.floor(Math.random()*500)
        user.coins += reward
        user.gems += 2
        user.daily = now
        addXP(50)
        return reply(`🎁 DAILY +${reward} coins +2 gems +50 XP\nBal: ${user.coins} 🐺`)
      }
      if (['work','hunt','fish','mine','beg','job','jobs','salary'].includes(command)) {
        const cooldown = { work: 300000, hunt: 600000, fish: 400000, mine: 800000, beg: 120000 }[command] || 300000
        if (Date.now() - user.work < cooldown) {
          const left = Math.ceil((cooldown - (Date.now() - user.work))/1000/60)
          return reply(`⏰ Cooldown! Wait ${left}m for ${command}`)
        }
        const rewards = { work: 200, hunt: 300, fish: 250, mine: 400, beg: 50, job: 200 }
        const base = rewards[command] || 200
        const earned = base + Math.floor(Math.random()*base)
        user.coins += earned
        user.work = Date.now()
        addXP(20)
        return reply(`💼 ${command.toUpperCase()} +${earned} coins!\nBal: ${user.coins} 🐺`)
      }
      if (command === 'rob' || command === 'steal') {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!target) return reply(`Usage: .rob @user`)
        const victim = global.wolfEco.users[target]
        if (!victim || victim.coins < 100) return reply(`❌ Victim has no coins`)
        if (Math.random() < 0.3) {
          const stolen = Math.floor(victim.coins*0.2)
          victim.coins -= stolen
          user.coins += stolen
          return reply(`🦹 Robbed ${stolen} from @${target.split('@')[0]}! 🐺`, { mentions: [target] })
        } else {
          const fine = Math.floor(user.coins*0.1)
          user.coins -= fine
          return reply(`🚨 Rob failed! Paid ${fine} fine! 🐺`)
        }
      }
      if (['gamble','bet','slots','lottery'].includes(command)) {
        if (!text) return reply(`Usage: .${command} <amount>`)
        const amount = parseInt(text)
        if (isNaN(amount) || user.coins < amount) return reply(`❌ Not enough coins! Bal: ${user.coins}`)
        if (command === 'slots') {
          const win = Math.random() > 0.6
          if (win) { user.coins += amount*2; return reply(`🎰 WIN +${amount*2}! Bal: ${user.coins} 🐺`) }
          else { user.coins -= amount; return reply(`🎰 LOST -${amount}! Bal: ${user.coins} 🐺`) }
        }
        if (command === 'lottery') {
          if (Math.random() < 0.05) { user.coins += amount*10; return reply(`🎟️ JACKPOT +${amount*10}! 🐺`) }
          else { user.coins -= amount; return reply(`🎟️ Lost -${amount} 🐺`) }
        }
        if (Math.random() > 0.5) { user.coins += amount; return reply(`🎲 Won +${amount}! Bal: ${user.coins} 🐺`) }
        else { user.coins -= amount; return reply(`🎲 Lost -${amount}! Bal: ${user.coins} 🐺`) }
      }
      if (command === 'deposit') {
        const amt = text === 'all' ? user.coins : parseInt(text)
        if (!amt || user.coins < amt) return reply(`❌ Not enough`)
        user.coins -= amt; user.bank += amt
        return reply(`🏦 Deposited ${amt}\nCoins: ${user.coins} Bank: ${user.bank} 🐺`)
      }
      if (command === 'withdraw') {
        const amt = text === 'all' ? user.bank : parseInt(text)
        if (!amt || user.bank < amt) return reply(`❌ Not enough bank`)
        user.bank -= amt; user.coins += amt
        return reply(`🏦 Withdrew ${amt}\nCoins: ${user.coins} Bank: ${user.bank} 🐺`)
      }
      if (command === 'pay' || command === 'transfer') {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        const amt = parseInt(text.split(' ').pop())
        if (!target || !amt) return reply(`Usage: .pay @user <amount>`)
        if (user.coins < amt) return reply(`❌ Not enough`)
        if (!global.wolfEco.users[target]) global.wolfEco.users[target] = { coins: 1000, gems: 10, bank: 0, xp: 0, level: 1, inventory: [], daily: 0, work: 0 }
        user.coins -= amt; global.wolfEco.users[target].coins += amt
        return reply(`💸 Paid ${amt} to @${target.split('@')[0]} 🐺`, { mentions: [target] })
      }
      if (['leaderboard','lb','top','rich','rank','level','xp'].includes(command)) {
        const sorted = Object.entries(global.wolfEco.users).sort((a,b)=>b[1].coins+b[1].bank-(a[1].coins+a[1].bank)).slice(0,10)
        let txt = `🏆 TOP 10 RICHEST\n\n`
        sorted.forEach(([id, u], i)=> txt += `${i+1}. @${id.split('@')[0]} - ${u.coins+u.bank} coins Lv${u.level}\n`)
        return sock.sendMessage(m.key.remoteJid, { text: txt, mentions: sorted.map(s=>s[0]) }, { quoted: m })
      }
      if (command === 'profile') {
        return reply(`👤 PROFILE @${userId.split('@')[0]}\nLv: ${user.level} XP: ${user.xp}\nCoins: ${user.coins} Gems: ${user.gems}\nBank: ${user.bank}\nInv: ${user.inventory.join(', ')||'Empty'}\n\n🐺`, { mentions: [userId] })
      }
      if (command === 'inventory' || command === 'inv') {
        return reply(`📦 INV: ${user.inventory.length ? user.inventory.join(', ') : 'Empty! .shop'}\n\n🐺`)
      }
      if (command === 'shop' || command === 'store') {
        let txt = `🛒 WOLF SHOP\n\n`
        global.wolfEco.shop.forEach(item=> txt += `${item.id} - ${item.name} - ${item.price} coins\n`)
        txt += `\nYour coins: ${user.coins}\n\n🐺`
        return reply(txt)
      }
      if (command === 'buy') {
        if (!text) return reply(`Usage: .buy <id> - .shop`)
        const item = global.wolfEco.shop.find(i=>i.id===text.toLowerCase())
        if (!item) return reply(`Item ${text} not found`)
        if (user.coins < item.price) return reply(`Need ${item.price}, have ${user.coins}`)
        user.coins -= item.price; user.inventory.push(item.id)
        return reply(`✅ Bought ${item.name} for ${item.price}!\nBal: ${user.coins} 🐺`)
      }
      if (command === 'sell') {
        if (!text) return reply(`Usage: .sell <id>`)
        const idx = user.inventory.indexOf(text.toLowerCase())
        if (idx===-1) return reply(`No ${text}`)
        const item = global.wolfEco.shop.find(i=>i.id===text.toLowerCase())
        const price = Math.floor((item?.price||100)*0.7)
        user.inventory.splice(idx,1); user.coins += price
        return reply(`✅ Sold ${text} for ${price}!\nBal: ${user.coins} 🐺`)
      }
      if (['craft','use','heal','eat'].includes(command)) {
        if (!text) return reply(`Usage: .${command} <item>`)
        if (!user.inventory.includes(text.toLowerCase())) return reply(`No ${text}`)
        return reply(`✨ Used ${text}! Effect applied! 🐺`)
      }
      if (['business','invest','stock','crypto'].includes(command)) {
        if (!text) return reply(`Usage: .${command} <amount>\nInvest coins for profit!`)
        const amount = parseInt(text)
        if (user.coins < amount) return reply(`❌ Not enough coins`)
        if (Math.random() > 0.5) {
          const profit = Math.floor(amount*0.3)
          user.coins += profit
          return reply(`📈 ${command} PROFIT +${profit}!\nBal: ${user.coins} 🐺`)
        } else {
          const loss = Math.floor(amount*0.2)
          user.coins -= loss
          return reply(`📉 ${command} LOSS -${loss}!\nBal: ${user.coins} 🐺`)
        }
      }
      if (command === 'seteconomy') {
        if (!text) return reply(`Usage: .seteconomy @user <amount>`)
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        const amt = parseInt(text.split(' ').pop())
        if (!target) return reply(`Tag user`)
        if (!global.wolfEco.users[target]) global.wolfEco.users[target] = { coins: 1000, gems: 10, bank: 0, xp: 0, level: 1, inventory: [], daily: 0, work: 0 }
        global.wolfEco.users[target].coins = amt
        return reply(`✅ Set @${target.split('@')[0]} coins to ${amt} 🐺`, { mentions: [target] })
      }
      if (command === 'reseteco') {
        global.wolfEco.users = {}
        return reply(`✅ Economy reset! 🐺`)
      }

    } catch (e) {
      reply(`❌ Economy Error: ${e.message} 🐺`)
    }
  }
          }
