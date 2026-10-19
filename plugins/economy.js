// 💰 ALPHA AND OMEGA WOLF XMD - FILE 10 ECONOMY - 50 CMDS REAL
module.exports = {
  command: ['balance','bal','daily','work','hunt','fish','mine','rob','steal','beg','gamble','bet','slots','lottery','bank','deposit','withdraw','pay','transfer','leaderboard','lb','top','rich','rank','level','xp','profile','inventory','inv','shop','buy','sell','craft','use','heal','eat','job','jobs','salary','business','invest','stock','crypto','wallet','coin','coins','gems','store','economy','seteconomy','reseteco'],

  execute: async (sock, m, { command, text, reply }) => {
    global.wolfEco = global.wolfEco || { users: {}, shop: [{ id: 'wolf', name: '🐺 WOLF PET', price: 1000 }, { id: 'sword', name: '⚔️ SWORD', price: 500 }, { id: 'shield', name: '🛡️ SHIELD', price: 700 }, { id: 'potion', name: '🧪 POTION', price: 100 }] }
    const userId = m.key.participant || m.key.remoteJid
    if (!global.wolfEco.users[userId]) global.wolfEco.users[userId] = { coins: 1000, gems: 10, bank: 0, xp: 0, level: 1, inventory: [], daily: 0, work: 0 }

    const user = global.wolfEco.users[userId]
    const addXP = (n) => { user.xp += n; if (user.xp >= user.level*1000) { user.level++; user.coins += 500; reply(`🎉 LEVEL UP! You are now level ${user.level}! +500 coins bonus! 🐺`) } }

    try {
      // .balance / .bal / .wallet / .coin / .coins / .gems / .bank / .economy
      if (['balance','bal','wallet','coin','coins','gems','bank','economy'].includes(command)) {
        return reply(`💰 *WOLF ECONOMY - BALANCE*\n\nUser: @${userId.split('@')[0]}\n\n💵 Coins: ${user.coins}\n💎 Gems: ${user.gems}\n🏦 Bank: ${user.bank}\n⭐ Level: ${user.level}\n✨ XP: ${user.xp}/${user.level*1000}\n\n📦 Inventory: ${user.inventory.length} items\n\n🐺 ALPHA AND OMEGA`, { mentions: [userId] })
      }

      // .daily
      if (command === 'daily') {
        const now = Date.now()
        if (now - user.daily < 86400000) {
          const left = Math.ceil((86400000 - (now - user.daily))/3600000)
          return reply(`⏰ Daily already claimed! Come back in ${left}h`)
        }
        const reward = 500 + Math.floor(Math.random()*500)
        user.coins += reward
        user.gems += 2
        user.daily = now
        addXP(50)
        return reply(`🎁 *DAILY REWARD CLAIMED*\n\n+${reward} coins\n+2 gems\n+50 XP\n\nBalance: ${user.coins} coins\n\n🐺`)
      }

      // .work / .hunt / .fish / .mine / .beg / .job / .jobs / .salary
      if (['work','hunt','fish','mine','beg','job','jobs','salary'].includes(command)) {
        const cooldown = { work: 300000, hunt: 600000, fish: 400000, mine: 800000, beg: 120000 }[command] || 300000
        if (Date.now() - user.work < cooldown) {
          const left = Math.ceil((cooldown - (Date.now() - user.work))/1000/60)
          return reply(`⏰ Cooldown! Wait ${left} minutes for ${command}`)
        }
        const rewards = { work: 200, hunt: 300, fish: 250, mine: 400, beg: 50, job: 200 }
        const base = rewards[command] || 200
        const earned = base + Math.floor(Math.random()*base)
        user.coins += earned
        user.work = Date.now()
        addXP(20)
        const msgs = {
          work: `You worked as developer and earned ${earned} coins! 💻`,
          hunt: `You hunted a deer and sold it for ${earned} coins! 🦌`,
          fish: `You caught ${Math.floor(Math.random()*5)+1} fish worth ${earned} coins! 🐟`,
          mine: `You mined ${earned} worth of diamonds! 💎`,
          beg: `A kind wolf gave you ${earned} coins! 🥺🐺`,
          job: `Job completed! Earned ${earned}`
        }
        return reply(`💼 *${command.toUpperCase()}*\n\n${msgs[command] || `Earned ${earned} coins!`}\n\nBalance: ${user.coins}\n\n🐺`)
      }

      // .rob / .steal
      if (command === 'rob' || command === 'steal') {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        if (!target) return reply(`Usage: .rob @user - Rob coins from user (30% success)`)
        const victim = global.wolfEco.users[target]
        if (!victim || victim.coins < 100) return reply(`❌ Victim has no coins to rob!`)
        if (Math.random() < 0.3) {
          const stolen = Math.floor(victim.coins*0.2)
          victim.coins -= stolen
          user.coins += stolen
          return reply(`🦹 *ROB SUCCESS*\n\nYou stole ${stolen} coins from @${target.split('@')[0]}!\n\n🐺`, { mentions: [target] })
        } else {
          const fine = Math.floor(user.coins*0.1)
          user.coins -= fine
          return reply(`🚨 *ROB FAILED*\n\nYou got caught and paid ${fine} fine!\n\n🐺`)
        }
      }

      // .gamble / .bet / .slots / .lottery
      if (['gamble','bet','slots','lottery'].includes(command)) {
        if (!text) return reply(`Usage: .${command} <amount> - Bet coins`)
        const amount = parseInt(text)
        if (isNaN(amount) || amount <= 0) return reply(`Enter valid amount`)
        if (user.coins < amount) return reply(`❌ Not enough coins! Balance: ${user.coins}`)
        if (command === 'slots') {
          const win = Math.random() > 0.6
          if (win) {
            const won = amount*2
            user.coins += won
            return reply(`🎰 *SLOTS WIN*\n\n🎉 JACKPOT! Won ${won} coins!\nBalance: ${user.coins}\n\n🐺`)
          } else {
            user.coins -= amount
            return reply(`🎰 *SLOTS LOST*\n\n😢 Lost ${amount} coins!\nBalance: ${user.coins}\n\n🐺`)
          }
        }
        if (command === 'lottery') {
          if (Math.random() < 0.05) { user.coins += amount*10; return reply(`🎟️ LOTTERY JACKPOT! Won ${amount*10} coins! 🐺`) }
          else { user.coins -= amount; return reply(`🎟️ Lost lottery! -${amount} coins 🐺`) }
        }
        // gamble/bet 50/50
        if (Math.random() > 0.5) { user.coins += amount; return reply(`🎲 You won ${amount} coins! Balance: ${user.coins} 🐺`) }
        else { user.coins -= amount; return reply(`🎲 You lost ${amount} coins! Balance: ${user.coins} 🐺`) }
      }

      // .deposit / .withdraw
      if (command === 'deposit') {
        const amt = text === 'all' ? user.coins : parseInt(text)
        if (!amt || user.coins < amt) return reply(`❌ Not enough coins`)
        user.coins -= amt
        user.bank += amt
        return reply(`🏦 Deposited ${amt} to bank\nCoins: ${user.coins}\nBank: ${user.bank}\n\n🐺`)
      }
      if (command === 'withdraw') {
        const amt = text === 'all' ? user.bank : parseInt(text)
        if (!amt || user.bank < amt) return reply(`❌ Not enough in bank`)
        user.bank -= amt
        user.coins += amt
        return reply(`🏦 Withdrew ${amt}\nCoins: ${user.coins}\nBank: ${user.bank}\n\n🐺`)
      }

      // .pay / .transfer
      if (command === 'pay' || command === 'transfer') {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
        const parts = text.split(' ')
        const amt = parseInt(parts[parts.length-1]) || parseInt(parts[0])
        if (!target || !amt) return reply(`Usage: .pay @user <amount>`)
        if (user.coins < amt) return reply(`❌ Not enough coins`)
        if (!global.wolfEco.users[target]) global.wolfEco.users[target] = { coins: 1000, gems: 10, bank: 0, xp: 0, level: 1, inventory: [], daily: 0, work: 0 }
        user.coins -= amt
        global.wolfEco.users[target].coins += amt
        return reply(`💸 Paid ${amt} coins to @${target.split('@')[0]}\nYour balance: ${user.coins}\n\n🐺`, { mentions: [target] })
      }

      // .leaderboard / .lb / .top / .rich / .rank / .level / .xp
      if (['leaderboard','lb','top','rich','rank','level','xp'].includes(command)) {
        const sorted = Object.entries(global.wolfEco.users).sort((a,b)=>b[1].coins + b[1].bank - (a[1].coins + a[1].bank)).slice(0,10)
        let txt = `🏆 *${command.toUpperCase()} - TOP 10 RICHEST*\n\n`
        sorted.forEach(([id, u], i)=> txt += `${i+1}. @${id.split('@')[0]} - ${u.coins + u.bank} coins - Lv${u.level}\n`)
        await sock.sendMessage(m.key.remoteJid, { text: txt, mentions: sorted.map(s=>s[0]) }, { quoted: m })
        return
      }

      // .profile / .inventory / .inv
      if (command === 'profile') {
        return reply(`👤 *PROFILE*\n\nUser: @${userId.split('@')[0]}\nLevel: ${user.level}\nXP: ${user.xp}\nCoins: ${user.coins}\nGems: ${user.gems}\nBank: ${user.bank}\nInventory: ${user.inventory.join(', ') || 'Empty'}\n\n🐺 ALPHA AND OMEGA`, { mentions: [userId] })
      }
      if (command === 'inventory' || command === 'inv') {
        return reply(`📦 *INVENTORY*\n\n${user.inventory.length ? user.inventory.map((it,i)=>`${i+1}. ${it}`).join('\n') : 'Empty! Use .shop to buy'}\n\n🐺`)
      }

      // .shop / .store
      if (command === 'shop' || command === 'store') {
        let txt = `🛒 *WOLF SHOP*\n\n`
        global.wolfEco.shop.forEach(item=> txt += `${item.id} - ${item.name} - ${item.price} coins\nUse .buy ${item.id}\n\n`)
        txt += `\nYour coins: ${user.coins}\n\n🐺`
        return reply(txt)
      }

      // .buy / .sell / .craft / .use / .heal / .eat
      if (command === 'buy') {
        if (!text) return reply(`Usage: .buy <item_id>\nUse .shop to see items`)
        const item = global.wolfEco.shop.find(i=>i.id===text.toLowerCase())
        if (!item) return reply(`Item ${text} not found`)
        if (user.coins < item.price) return reply(`Need ${item.price} coins, you have ${user.coins}`)
        user.coins -= item.price
        user.inventory.push(item.id)
        return reply(`✅ Bought ${item.name} for ${item.price} coins!\nInventory: ${user.inventory.length}\nBalance: ${user.coins}\n\n🐺`)
      }
      if (command === 'sell') {
        if (!text) return reply(`Usage: .sell <item_id>`)
        const idx = user.inventory.indexOf(text.toLowerCase())
        if (idx===-1) return reply(`You don't have ${text}`)
        const item = global.wolfEco.shop.find(i=>i.id===text.toLowerCase())
        const price = Math.floor((item?.price || 100)*0.7)
        user.inventory.splice(idx,1)
        user.coins += price
        return reply(`✅ Sold ${text} for ${price} coins!\nBalance: ${user.coins}\n\n🐺`)
      }
      if (['craft','use','heal','eat'].includes(command)) {
        if (!text) return reply(`Usage: .${command} <item>`)
        if (!user.inventory.includes(text.toLowerCase())) return reply(`You don't have ${text}`)
        return reply(`✨ Used ${text}! Effect applied!\n\n🐺 (Real logic: remove from inventory and apply buff)`)
      }

      // .business / .invest / .stock / .crypto
      if (['business','invest','stock','crypto'].includes(command)) {
        if (!text) return reply(`Usage: .${command} <amount>\nInvest coins
