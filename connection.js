// 🐺 WOLF XMD - MERGED SIMON LINK ENGINE + WOLF TYPE 2 - FINAL FIX
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
  downloadMediaMessage
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const fs = require('fs');

let settings;
try { settings = require('./settings'); } catch {
  settings = { botName: "WOLF XMD", ownerName: "Simon", ownerNumber: "239166265317", prefix: ".", mode: "public", port: 10000, extraOwners: [], auto: { antiLink: false, antiSpam: true, antidelete: true, welcome: false, antiCall: true, antiDelPath: "log" }, SESSION_ID: process.env.SESSION_ID || "" };
}

global.sock = null; global.isConnected = false; global.connectionStatus = 'STARTING...'; global.appStarted = false;
let lastGeneratedSession = null;

global.db = global.db || {};
global.db.groups = global.db.groups || {};
global.db.settings = global.db.settings || { prefix: settings.prefix || ".", mode: settings.mode || "public", ...settings.auto };
global.db.banned = []; global.db.warnings = {}; global.db.messages = {}; global.db.spam = {}; global.db.sudo = [settings.ownerNumber + '@s.whatsapp.net', "239166265317@s.whatsapp.net", ...settings.extraOwners.map(n=> n+"@s.whatsapp.net")];

function getGroup(jid){ global.db.groups[jid]=global.db.groups[jid]||{antilink:settings.auto?.antiLink, antibot:false, antispam:settings.auto?.antiSpam, antiviewonce:true, antidelete:settings.auto?.antidelete, welcome:settings.auto?.welcome}; return global.db.groups[jid]; }
global.plugins=new Map(); global.wolfCommands={};
function loadPlugins(){ const pPath=path.join(__dirname,'plugins'); if(!fs.existsSync(pPath)) return; global.plugins.clear(); global.wolfCommands={}; let t=0; function rd(dir){ const items=fs.readdirSync(dir); for(const it of items){ const full=path.join(dir,it); const st=fs.statSync(full); if(st.isDirectory()) rd(full); else if(it.endsWith('.js')){ try{ delete require.cache[require.resolve(full)]; const d=require(full); const arr=Array.isArray(d)?d:[d]; for(const pl of arr){ if(pl&&pl.name&&pl.execute){global.plugins.set(pl.name.toLowerCase(),pl); global.wolfCommands[pl.name.toLowerCase()]=pl.execute; if(pl.alias) for(const a of pl.alias){global.plugins.set(a.toLowerCase(),pl); global.wolfCommands[a.toLowerCase()]=pl.execute;} t++;} else if(pl&&pl.command&&pl.execute){for(const cmd of pl.command){global.plugins.set(cmd.toLowerCase(),pl); global.wolfCommands[cmd.toLowerCase()]=pl.execute;} t++;}}}catch{}}}} rd(pPath); console.log(chalk.green(`✅ WOLF WIRED ${t} files | ${Object.keys(global.wolfCommands).length} CMDS`)); }

async function handleSessionId(){
  const sp='./session'; if(!fs.existsSync(sp)) fs.mkdirSync(sp,{recursive:true});
  const sid=process.env.SESSION_ID||settings.SESSION_ID; if(!sid) return false;
  if(fs.existsSync(path.join(sp,'creds.json')) && fs.statSync(path.join(sp,'creds.json')).size>100) return true;
  try{ let clean=sid.trim(); if(clean.includes('~')) clean=clean.split('~')[1]; let dec=Buffer.from(clean,'base64').toString('utf-8'); if(!dec.trim().startsWith('{')){ try{ dec=Buffer.from(dec,'base64').toString('utf-8'); }catch{} } const data=JSON.parse(dec); fs.writeFileSync(path.join(sp,'creds.json'), JSON.stringify(data,null,2)); console.log(chalk.green("[WOLF] SESSION decoded!")); return true; }catch(e){ console.log(chalk.red("Decode fail "+e.message)); return false; }
}

async function startConnection(){
  if(!global.appStarted){
    const app=express(); app.use(express.json()); app.use(express.urlencoded({extended:true})); app.use(express.static(__dirname));
    app.get('/',(req,res)=>{ const idx=path.join(__dirname,'index.html'); if(fs.existsSync(idx)) return res.sendFile(idx); res.send('<h1>WOLF TYPE 2</h1>'); });
    app.get('/health',(req,res)=>res.send('WOLF LIVE'));
    app.get('/api/status',(req,res)=>res.json({botName:"WOLF XMD", status:global.connectionStatus, isConnected:global.isConnected, lastSession: lastGeneratedSession ? 'yes':'no', sessionEnv: !!process.env.SESSION_ID}));

    // ✅ SIMON STYLE GETCODE - USES GLOBAL SOCK - FIXES VYLW46PW
    app.get('/getcode', async (req,res)=>{
      try{
        let phone=(req.query.number||'').replace(/[^0-9]/g,'');
        if(!phone) return res.json({error:'Add ?number=239166265317'});
        if(!global.sock) return res.json({error:'Bot starting... wait 5 sec and retry'});
        if(global.isConnected) return res.json({error:'Already linked as MAIN BOT!'});
        const code=await global.sock.requestPairingCode(phone);
        console.log(chalk.green.bold(`🔑 WOLF CODE ${phone}: ${code}`));
        global.connectionStatus=`CODE: ${code}`;
        res.json({code: code, phone, success:true});
      }catch(e){ console.log('Pair fail',e.message); res.json({error:e.message}); }
    });

    app.post('/api/pair', async (req,res)=>{
      try{
        let phone=(req.body.phone||req.body.number||'').replace(/[^0-9]/g,'');
        if(phone.length<10) return res.json({success:false, message:'Enter valid number'});
        if(!global.sock) return res.json({success:false, message:'Starting... wait 5 sec'});
        const code=await global.sock.requestPairingCode(phone);
        console.log(chalk.yellow(`🔑 WOLF CODE ${phone}: ${code}`));
        res.json({success:true, code});
      }catch(e){ res.json({success:false, message:e.message}); }
    });

    app.get('/check-session',(req,res)=>{
      if(lastGeneratedSession) return res.json({session:lastGeneratedSession});
      if(fs.existsSync('./session/creds.json')){
        try{ const c=fs.readFileSync('./session/creds.json'); if(c.length>100){ const s='WOLF~'+Buffer.from(c).toString('base64'); lastGeneratedSession=s; return res.json({session:s}); } }catch{}
      }
      res.json({});
    });

    app.post('/deploy', async (req,res)=>{
      const {sessionId}=req.body; if(!sessionId||!sessionId.startsWith('WOLF~')) return res.json({error:'Invalid'});
      try{ lastGeneratedSession=sessionId; if(!fs.existsSync('./session')) fs.mkdirSync('./session',{recursive:true}); let clean=sessionId.split('~')[1]; let dec=Buffer.from(clean,'base64').toString('utf-8'); if(!dec.trim().startsWith('{')) dec=Buffer.from(dec,'base64').toString('utf-8'); const data=JSON.parse(dec); fs.writeFileSync('./session/creds.json', JSON.stringify(data,null,2)); res.json({success:true}); }catch(e){ res.json({error:e.message}); }
    });

    const PORT=settings.port||process.env.PORT||10000; app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 WOLF Dashboard http://0.0.0.0:${PORT}`))); global.appStarted=true;
  }

  async function initBaileys(){
    try{
      if(!fs.existsSync('./session')) fs.mkdirSync('./session',{recursive:true});
      const hasSession = await handleSessionId();
      const {state,saveCreds}=await useMultiFileAuthState('./session'); const {version}=await fetchLatestBaileysVersion();
      const sock=makeWASocket({ version, logger:pino({level:'silent'}), printQRInTerminal:false, browser:Browsers.macOS('Desktop'), auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))}, markOnlineOnConnect:true, connectTimeoutMs:60000, keepAliveIntervalMs:10000 });
      global.sock=sock; sock.ev.on('creds.update', saveCreds);

      sock.ev.on('connection.update', async (update)=>{
        const {connection,lastDisconnect}=update;
        if(connection==='connecting') global.connectionStatus='Connecting...';
        if(connection==='open'){
          // ✅ GENERATE WOLF~ SESSION ON PAIR
          if(fs.existsSync('./session/creds.json')){
            try{
              const creds=fs.readFileSync('./session/creds.json');
              const sess='WOLF~'+Buffer.from(creds).toString('base64');
              lastGeneratedSession=sess;
              console.log(chalk.green.bold(`\n✅ WOLF~ GENERATED:\n${sess.substring(0,80)}...\n`));
              // DM to owner number if we know it? Send to self first, will auto poll
            }catch{}
          }

          global.isConnected=true; global.connectionStatus='ONLINE ✅ WOLF XMD'; console.log(chalk.green.bold(`\n✅ WOLF XMD ONLINE! ${Object.keys(global.wolfCommands).length} CMDS\n`)); loadPlugins();
          try{ const mainHandler=require('./main.js'); await mainHandler(sock); console.log(chalk.green("✅ main.js loaded")); }catch(e){ console.log("main.js err "+e.message); }
          try{ const jid=sock.user.id; await sock.sendMessage(jid,{text:`✅ *WOLF XMD TITAN TYPE 2 LINKED*\n\nPrefix: ${settings.prefix||"."}\nMode: ${settings.mode}\n⚡ ${Object.keys(global.wolfCommands).length} CMDS\n\nYour SESSION_ID:\n${lastGeneratedSession ? lastGeneratedSession.substring(0,100)+'...' : 'Check dashboard /check-session'}\n\nType ${settings.prefix||"."}menu`}).catch(()=>{}); if(lastGeneratedSession){ await sock.sendMessage(jid,{text:lastGeneratedSession}).catch(()=>{}); } }catch{}
        }
        if(connection==='close'){
          const code=lastDisconnect?.error?.output?.statusCode; console.log(chalk.red(`❌ Closed ${code}`)); global.isConnected=false; global.sock=null;
          if([DisconnectReason.loggedOut,401,440,405].includes(code)){ try{ fs.rmSync('./session',{recursive:true,force:true}); }catch{} lastGeneratedSession=null; global.connectionStatus='LOGGED OUT - Pair again'; setTimeout(()=>initBaileys(),3000); }
          else{ global.connectionStatus='Reconnecting...'; setTimeout(()=>initBaileys(),5000); }
        }
      });

      // Keep message handler for commands
      sock.ev.on('messages.upsert', async ({messages,type})=>{
        try{
          if(type!=='notify') return; const m=messages[0]; if(!m?.message) return; const from=m.key.remoteJid; if(from==='status@broadcast') return;
          const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||"";
          if(!body) return; const prefix=global.db.settings.prefix||settings.prefix||'.'; if(!body.trim().startsWith(prefix)) return;
          const args=body.trim().slice(prefix.length).trim().split(/ +/); const rawCmd=args.shift()?.toLowerCase(); if(!rawCmd) return;
          const plugin=global.plugins.get(rawCmd); if(!plugin) return;
          m.body=body; m.text=args.join(' '); m.args=args; m.sender=m.key.participant||from; m.chat=from; m.from=from; m.isGroup=from.endsWith('@g.us'); m.isOwner=m.sender.includes('239166265317')||global.db.sudo.includes(m.sender)||m.key.fromMe;
          m.reply=async(txt)=>await sock.sendMessage(from,{text:txt},{quoted:m});
          m.download=async()=>await downloadMediaMessage(m,'buffer',{},{logger:pino({level:"silent"}),reuploadRequest:sock.updateMediaMessage});
          console.log(chalk.green(`▶️ ${rawCmd}`));
          if(plugin.execute.length===3){ await plugin.execute(sock,m,{command:rawCmd,text:args.join(' '),args, reply:m.reply, isOwner:m.isOwner, prefix}); }
          else { await plugin.execute(m,{sock,prefix,args,command:rawCmd,config:settings,plugins:global.plugins,from,sender:m.sender,getGroup}); }
        }catch(e){ console.log(`Exec err: ${e.message}`); }
      });
    }catch(e){ console.log(e.message); setTimeout(()=>initBaileys(),5000); }
  }
  await initBaileys();
}

module.exports={startConnection};
if(require.main===module){ startConnection(); }
