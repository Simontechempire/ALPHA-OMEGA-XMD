// 🐺 CONNECTION.JS - WOLF XMD - FINAL WORKING - NO FS-EXTRA BUG
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const fs = require('fs');

const config = { botName: "WOLF XMD", ownerNumber: "239166265317", prefix: ".", sessionName: "session", PORT: process.env.PORT || 10000 };

let global_sock = null;
let isConnected = false;
let pairingCode = null;
let currentPhone = null;
let lastPairTime = 0;
let appStarted = false;
let commands = {};

function loadPlugins(){
  const pPath = path.join(__dirname, 'plugins');
  if(!fs.existsSync(pPath)) { fs.mkdirSync(pPath, {recursive:true}); return {}; }
  let map = {};
  let count = 0;
  const files = fs.readdirSync(pPath).filter(f=>f.endsWith('.js'));
  for(const file of files){
    try{
      const fp = path.join(pPath, file);
      delete require.cache[require.resolve(fp)];
      const mod = require(fp);
      const list = Array.isArray(mod) ? mod : [mod];
      for(const pl of list){
        if(pl && pl.command && pl.execute){
          for(const c of pl.command){
            map[c.toLowerCase()] = pl.execute;
            map[c.toLowerCase().replace(/[^a-z0-9]/g,'')] = pl.execute;
          }
          count++;
        } else if(pl && pl.name && pl.execute){
          map[pl.name.toLowerCase()] = pl.execute;
          if(pl.alias) pl.alias.forEach(a=> map[a.toLowerCase()] = pl.execute);
          count++;
        }
      }
    }catch(e){ console.log(`Load err ${file}: ${e.message}`); }
  }
  console.log(chalk.magenta(`🐺 LOADED ${count} files | ${Object.keys(map).length} cmds`));
  return map;
}

async function startConnection(){
  if(!appStarted){
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname));

    app.get('/', (req,res)=>{
      const idx = path.join(__dirname, 'index.html');
      if(fs.existsSync(idx)) return res.sendFile(idx);
      return res.send(`<h1>🐺 WOLF XMD TITAN</h1><p>${Object.keys(commands).length} CMDS</p><p>Owner 239166265317</p>`);
    });
    app.get('/api/status', (req,res)=> res.json({ bot:"WOLF XMD", owner:"239166265317", isConnected, pairingCode, cmds: Object.keys(commands).length }));

    async function getCode(phone){
      phone = (phone||'').toString().replace(/[^0-9]/g,'');
      if(!phone) throw new Error('Number required');
      if(!global_sock) throw new Error('Bot starting... wait 5s');
      if(isConnected) throw new Error('Already linked!');
      const now = Date.now();
      if(pairingCode && (now-lastPairTime)<50000) return pairingCode;
      if((now-lastPairTime)<10000) throw new Error(`Wait ${Math.ceil((10000-(now-lastPairTime))/1000)}s`);
      lastPairTime = now;
      const code = await global_sock.requestPairingCode(phone);
      pairingCode = code;
      currentPhone = phone;
      console.log(chalk.green.bold(`🔑 CODE ${phone}: ${code}`));
      return code;
    }

    app.post('/api/pair', async(req,res)=>{
      try{ const code = await getCode(req.body.phone || req.body.number); res.json({success:true, code, phone: currentPhone}); }
      catch(e){ res.json({success:false, message:e.message}); }
    });
    app.get('/getcode', async(req,res)=>{
      try{ const code = await getCode(req.query.number || req.query.phone); res.json({success:true, code, phone: currentPhone, codeFormatted: code.match(/.{1,4}/g).join("-")}); }
      catch(e){ res.json({success:false, message:e.message}); }
    });

    const PORT = config.PORT || 10000;
    app.listen(PORT, '0.0.0.0', ()=> console.log(chalk.cyan(`🌐 Dashboard on ${PORT}`)));
    appStarted = true;
  }

  commands = loadPlugins();
  const {state, saveCreds} = await useMultiFileAuthState(`./${config.sessionName}`);
  const {version} = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, logger: pino({level:'silent'}), printQRInTerminal:false, browser: Browsers.macOS('Safari'), auth: {creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'}))}, markOnlineOnConnect:true, syncFullHistory:false });
  global_sock = sock;
  global.sock = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async({connection, lastDisconnect})=>{
    if(connection==='open'){ isConnected=true; pairingCode=null; console.log(chalk.green.bold(`\n✅ WOLF CONNECTED - ${Object.keys(commands).length} CMDS\n`)); }
    if(connection==='close'){
      isConnected=false;
      global_sock=null;
      const code = lastDisconnect?.error?.output?.statusCode;
      console.log(chalk.red(`Closed ${code}`));
      if(code===DisconnectReason.loggedOut){ try{ fs.rmSync(`./${config.sessionName}`,{recursive:true,force:true}); }catch{} }
      setTimeout(()=> startConnection(), 3000);
    }
  });

  sock.ev.on('messages.upsert', async({messages})=>{
    try{
      const m = messages[0];
      if(!m?.message || m.key.fromMe) return;
      let body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
      if(!body.startsWith('.')) return;
      const args = body.slice(1).trim().split(/ +/);
      const raw = args.shift().toLowerCase();
      const cmd = raw.replace(/[^a-z0-9]/g,'') || raw;
      const exec = commands[raw] || commands[cmd];
      if(!exec) return;
      console.log(chalk.yellow(`▶️ ${cmd}`));
      await exec(sock, m, {command:cmd, text:args.join(' '), args, reply: async(txt)=> await sock.sendMessage(m.key.remoteJid, {text:txt}, {quoted:m}), isOwner: m.key.remoteJid.includes('239166265317') || m.key.fromMe, prefix:'.'});
    }catch(e){ console.log(`Exec err ${e.message}`); }
  });
}

// EXPORTS - MUST BE AT BOTTOM
module.exports.startConnection = startConnection;
module.exports.AlphaOmegaConnection = startConnection;

// AUTO START IF RUN DIRECTLY: node connection.js
if(require.main === module){
  startConnection().catch(e=>{ console.log(e.message); setTimeout(()=>startConnection(), 3000); });
  }
