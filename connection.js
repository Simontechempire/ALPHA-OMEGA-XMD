// 🐺 WOLF XMD TITAN - FAST EDITION V2 - FIX MENU / KICK / ANTILINK / OFFLINE
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

const msgRetryCounterCache = {
  _cache: new Map(),
  get(k){ return this._cache.get(k); },
  set(k,v){ this._cache.set(k,v); return v; },
  del(k){ this._cache.delete(k); },
  has(k){ return this._cache.has(k); }
};

const msgStore = new Map();
function storeMsg(m){
  if(!m?.key?.id) return;
  msgStore.set(m.key.id, m.message);
  if(msgStore.size > 500) msgStore.delete(msgStore.keys().next().value);
}
async function getMessage(key){
  if(!key?.id) return undefined;
  return msgStore.get(key.id);
}

let config;
try { config = require('./settings'); } catch {
  config = { botName: "ALPHA AND OMEGA WOLF XMD", ownerName: "ALPHA", ownerNumber: "239166265317", prefix: ".", sessionName: "session", PORT: process.env.PORT || 10000 };
}
config.ownerNumber = "239166265317";
config.botName = "🐺 WOLF XMD TITAN";
config.sessionName = "session";

global.sock = null; global.isConnected = false; global.connectionStatus = '⚠️ NOT LINKED'; global.pairingCode = null; global.currentPairingNumber = null; global.lastPairTime = 0; global.appStarted = false;

global.db = global.db || {};
global.db.groups = global.db.groups || {};
global.db.settings = global.db.settings || { prefix: ".", mode: "public", autoread: false, autostatus: false, autovv: false, autolike: false, autoreact: false, autotyping: false, autopresence: false, autoreply: false, anticall: false };
global.db.banned = global.db.banned || [];
global.db.warnings = global.db.warnings || {};
global.db.messages = global.db.messages || {};
global.db.spam = global.db.spam || {};
global.db.sudo = global.db.sudo || [config.ownerNumber + '@s.whatsapp.net', "239166265317@s.whatsapp.net"];

function getGroup(jid){
  global.db.groups[jid] = global.db.groups[jid] || { antilink:false, antibot:false, antispam:false, antiviewonce:false, antidelete:false, welcome:false, goodbye:false, welcomeText:"", goodbyeText:"" };
  return global.db.groups[jid];
}

global.plugins=new Map();
global.wolfCommands={};

function loadPlugins(){
  const possiblePaths = [path.join(__dirname,'plugins'), path.join(__dirname,'../plugins'), path.join(__dirname,'src/plugins')];
  let pPath = null;
  for(const pp of possiblePaths){ if(fs.existsSync(pp)){ pPath=pp; break; } }
  if(!pPath) { console.log(chalk.red('No plugins folder found')); return; }
  global.plugins.clear();
  global.wolfCommands={};
  let t=0;
  const IGNORED = ['main.js','index.js','connection.js','settings.js','config.js','app.js','bot.js','server.js'];
  function rd(dir){
    const items=fs.readdirSync(dir);
    for(const it of items){
      const full=path.join(dir,it);
      const st=fs.statSync(full);
      if(st.isDirectory()){
        if(it === 'node_modules' || it.startsWith('.') || IGNORED.includes(it)) continue;
        rd(full);
      }
      else if(it.endsWith('.js')){
        if(IGNORED.includes(it)) continue;
        try{
          delete require.cache[require.resolve(full)];
          const d=require(full);
          const arr=Array.isArray(d)?d:[d];
          for(const pl of arr){
            if(pl&&pl.name&&pl.execute){
              global.plugins.set(pl.name.toLowerCase(),pl);
              global.wolfCommands[pl.name.toLowerCase()]=pl.execute;
              if(pl.alias) for(const a of pl.alias) {
                global.plugins.set(a.toLowerCase(),pl);
                global.wolfCommands[a.toLowerCase()]=pl.execute;
              }
              t++;
            } else if(pl&&pl.command&&pl.execute){
              for(const cmd of pl.command){
                const clean=cmd.toLowerCase();
                global.plugins.set(clean, pl);
                global.wolfCommands[clean]=pl.execute;
              }
              t++;
            }
          }
        }catch(e){ console.log(`Load err ${it}: ${e.message}`)}
      }
    }
  }
  rd(pPath);
  console.log(chalk.green(`✅ WOLF WIRED ${t} files | ${Object.keys(global.wolfCommands).length} CMDS from ${pPath}`));
}
loadPlugins();

const groupCache=new Map();
async function getCachedMeta(sock,jid){
  const c=groupCache.get(jid); if(c && Date.now()-c.time<90000) return c.meta;
  try{ const meta=await sock.groupMetadata(jid); groupCache.set(jid,{meta,time:Date.now()}); if(groupCache.size>50) groupCache.delete(groupCache.keys().next().value); return meta; }catch{ return null; }
}

async function startConnection(){
  if(!global.appStarted){
    const app=express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname));
    app.use(express.static(path.join(__dirname,'../public')));
    app.get('/',(req,res)=>{
      const idx1 = path.join(__dirname,'index.html');
      const idx2 = path.join(__dirname,'../public/index.html');
      if(fs.existsSync(idx1)) return res.sendFile(idx1);
      if(fs.existsSync(idx2)) return res.sendFile(idx2);
      res.send(`<h1>🐺 WOLF XMD TITAN</h1><p>Owner: 239166265317</p><p>CMDS: ${Object.keys(global.wolfCommands).length}</p><p><a href="/api/status">Status</a> | <a href="/getcode?number=239166265317">Get Code</a></p>`);
    });
    app.get('/health',(req,res)=>res.send('WOLF LIVE'));
    app.get('/api/status',(req,res)=>res.json({ botName:"WOLF XMD TITAN", owner:"239166265317", status:global.connectionStatus, isConnected:global.isConnected, pairingCode:global.pairingCode, plugins:Object.keys(global.wolfCommands).length }));
    app.post('/api/pair',async(req,res)=>{
      try{
        let phone=(req.body.phone||req.body.number||'').replace(/[^0-9]/g,'');
        if(phone.length<10) return res.json({success:false,message:'Enter valid number e.g 239166265317'});
        if(!global.sock) return res.json({success:false,message:'Bot starting... wait 5 sec'});
        if(global.isConnected) return res.json({success:false,message:'Already linked!'});
        const code=await global.sock.requestPairingCode(phone);
        global.pairingCode=code; global.currentPairingNumber=phone; global.connectionStatus=`CODE: ${code}`;
        console.log(chalk.yellow(`🔑 WOLF CODE ${phone}: ${code}`));
        res.json({success:true,code});
      }catch(e){ console.log('Pair fail',e.message); res.json({success:false,message:e.message}); }
    });
    app.get('/getcode',async(req,res)=>{
      try{
        let phone=(req.query.number||req.query.phone||'').replace(/[^0-9]/g,'');
        if(!phone) return res.json({success:false,message:'Add ?number=239166265317'});
        if(!global.sock) return res.json({success:false,message:'Bot starting... wait 5 sec'});
        if(global.isConnected) return res.json({success:false,message:'Already linked!'});
        const code=await global.sock.requestPairingCode(phone);
        global.pairingCode=code; global.currentPairingNumber=phone; global.connectionStatus=`CODE: ${code}`;
        console.log(chalk.green.bold(`🔑 WOLF CODE ${phone}: ${code}`));
        res.json({success:true, code, phone, codeFormatted: code.match(/.{1,4}/g)?.join("-")});
      }catch(e){ console.log('Pair fail',e.message); res.json({success:false,message:e.message}); }
    });
    app.post('/api/logout',async(req,res)=>{ try{ if(global.sock) await global.sock.logout().catch(()=>{}); }catch{} try{ fs.rmSync(`./${config.sessionName}`,{recursive:true,force:true}); fs.rmSync(`./auth`,{recursive:true,force:true}); }catch{} global.sock=null; global.isConnected=false; res.json({success:true}); setTimeout(()=>initBaileys(),2000); });
    const PORT=config.PORT||process.env.PORT||10000;
    app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 WOLF Dashboard ${PORT} | ${Object.keys(global.wolfCommands).length} CMDS`)));
    global.appStarted=true;
  }

  async function initBaileys(){
    try{
      const authPath=`./${config.sessionName}`;
      if((!fs.existsSync(authPath)||fs.readdirSync(authPath).length===0)&&process.env.SESSION_DATA){
        fs.mkdirSync(authPath,{recursive:true}); let d; try{ d=JSON.parse(process.env.SESSION_DATA); }catch{ d=JSON.parse(Buffer.from(process.env.SESSION_DATA,'base64').toString()); } fs.writeFileSync(path.join(authPath,'creds.json'),JSON.stringify(d,null,2));
      }
    }catch(e){}
    const {state,saveCreds}=await useMultiFileAuthState(`./${config.sessionName}`);
    const {version}=await fetchLatestBaileysVersion();
    const sock=makeWASocket({
      version,
      logger:pino({level:'silent'}),
      printQRInTerminal:false,
      browser:Browsers.macOS('Safari'),
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))},
      markOnlineOnConnect:true,
      connectTimeoutMs:60000,
      keepAliveIntervalMs:10000,
      syncFullHistory:false,
      retryRequestDelayMs:2000,
      msgRetryCounterCache,
      getMessage,
      generateHighQualityLinkPreview: false,
      shouldSyncHistoryMessage: () => false
    });
    global.sock=sock; sock.ev.on('creds.update',saveCreds);

    sock.ev.on('call',async(calls)=>{ for(let c of calls){ try{ if(global.db.settings.anticall) await sock.rejectCall(c.id,c.from); }catch{} } });
    sock.ev.on('messages.update',async(updates)=>{ for(let up of updates){ if(up.update.message===null){ const saved=global.db.messages[up.key.id]; if(!saved) continue; const g=getGroup(saved.from); if(!g.antidelete) continue; try{ await sock.sendMessage(saved.from,{text:`*🔍 ANTI-DELETE WOLF*\nFrom: @${saved.sender.split('@')[0]}\n> ${saved.text?.slice(0,300)}`,mentions:[saved.sender]}); }catch{} } } });

    sock.ev.on('connection.update',async(update)=>{
      const {connection,lastDisconnect}=update;
      if(connection==='connecting') global.connectionStatus='Connecting WOLF...';
      if(connection==='open'){
        global.isConnected=true; global.connectionStatus='ONLINE ✅ WOLF'; console.log(chalk.green.bold(`\n✅ WOLF ONLINE! ${Object.keys(global.wolfCommands).length} CMDS\n`));
      }
      if(connection==='close'){
        const code=lastDisconnect?.error?.output?.statusCode; console.log(chalk.red(`❌ Closed ${code}`)); global.isConnected=false; global.sock=null; groupCache.clear();
        if([DisconnectReason.loggedOut,401,440,405].includes(code)){ try{ fs.rmSync(`./${config.sessionName}`,{recursive:true,force:true}); }catch{} global.connectionStatus='LOGGED OUT'; setTimeout(()=>initBaileys(),3000); }
        else{ global.connectionStatus='Reconnecting WOLF...'; setTimeout(()=>initBaileys(),5000); }
      }
    });

    sock.ev.on('messages.upsert',async({messages,type})=>{
      try{
        if(type!=='notify') return;
        for(const m of messages){
          try{
            if(!m?.message) continue;
            storeMsg(m);
            const from=m.key.remoteJid;
            if(from==='status@broadcast'){ if(global.db.settings.autostatus){ sock.readMessages([m.key]).catch(()=>{}); } continue; }
            const sender=m.key.participant||from; const isGroup=from.endsWith('@g.us');
            const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||"";
            if(m.key.id){ global.db.messages[m.key.id]={text:body,sender,from,time:Date.now(), message:m.message}; if(Object.keys(global.db.messages).length>150) delete global.db.messages[Object.keys(global.db.messages)[0]]; }
            if(global.db.settings.autoread) sock.readMessages([m.key]).catch(()=>{});

            // === FIX 2: REAL ADMIN CHECK ===
            let meta=null, isAdmin=false, isBotAdmin=false, participants=[];
            if(isGroup){
              meta=await getCachedMeta(sock,from);
              participants=meta?.participants||[];
              const me=participants.find(p=>p.id===sock.user.id);
              const senderP=participants.find(p=>p.id===sender);
              isBotAdmin=!!(me?.admin==='admin'||me?.admin==='superadmin');
              isAdmin=!!(senderP?.admin==='admin'||senderP?.admin==='superadmin');
            }
            const isOwner=sender.includes('239166265317')||global.db.sudo.includes(sender)||m.key.fromMe;
            const isSenderAdmin=isAdmin||isOwner;

            // === FIX 4: REAL ANTILINK / ANTIBOT ===
            if(isGroup && !m.key.fromMe){
              const g=getGroup(from);
              if(g.antilink && !isSenderAdmin){
                const hasLink=/(https?:\/\/|www\.|chat\.whatsapp\.com|wa\.me\/|t\.me\/|instagram\.com|youtube\.com)/i.test(body);
                if(hasLink){
                  if(isBotAdmin){
                    try{ await sock.sendMessage(from,{delete:m.key}).catch(()=>{}); await sock.sendMessage(from,{text:`⚠️ @${sender.split('@')[0]} links not allowed!`,mentions:[sender]}).catch(()=>{}); }catch{}
                  } else {
                    await sock.sendMessage(from,{text:`⚠️ @${sender.split('@')[0]} link detected but I'm not admin, make me admin to delete!`,mentions:[sender]}).catch(()=>{});
                  }
                  continue;
                }
              }
              if(g.antibot && !isSenderAdmin && m.key.id && m.key.id.startsWith('BAE5')){
                if(isBotAdmin){ try{ await sock.sendMessage(from,{delete:m.key}).catch(()=>{}); }catch{} }
                continue;
              }
              if((global.db.settings.autovv||g.antiviewonce)&&(m.message.viewOnceMessage||m.message.viewOnceMessageV2||m.message.viewOnceMessageV2Extension)){
                (async()=>{ try{ const q=m.message.viewOnceMessage||m.message.viewOnceMessageV2Extension; const inner=q?.message||q; if(inner?.imageMessage) await sock.sendMessage(from,{image:inner.imageMessage},{quoted:m}).catch(()=>{}); else if(inner?.videoMessage) await sock.sendMessage(from,{video:inner.videoMessage},{quoted:m}).catch(()=>{}); else await sock.sendMessage(from,{forward:q},{quoted:m}).catch(()=>{}); }catch{} })();
              }
            }

            if(!body) continue;
            const prefix=global.db.settings.prefix||config.prefix||'.'; if(!body.trim().startsWith(prefix)) continue;
            const args=body.trim().slice(prefix.length).trim().split(/ +/); const rawCmd=args.shift()?.toLowerCase(); if(!rawCmd) continue;
            const cmdName=rawCmd.replace(/[^a-z0-9]/g,'')||rawCmd;
            let plugin = global.plugins.get(rawCmd) || global.plugins.get(cmdName) || global.wolfCommands[rawCmd] || global.wolfCommands[cmdName];
            if(!plugin){
              const fn = global.wolfCommands[rawCmd] || global.wolfCommands[cmdName];
              if(fn && typeof fn === 'function'){ plugin = { execute: fn, isWolfStyle: true }; }
            }
            if(!plugin) continue;
            if(global.db.banned.includes(sender)) continue;

            m.body=body; m.text=args.join(' '); m.args=args; m.sender=sender; m.chat=from; m.from=from; m.isGroup=isGroup; m.fromMe=m.key.fromMe; m.pushName=m.pushName||"ALPHA";
            m.isOwner=isOwner;
            m.isAdmin=isSenderAdmin; m.isBotAdmin=isBotAdmin; m.isGroupAdmin=isSenderAdmin;
            m.groupMetadata=meta; m.participants=participants; m.metadata=meta;
            m.botNumber=sock.user.id; m.botJid=sock.user.id;
            m.reply=async(txt)=>await sock.sendMessage(from,{text:typeof txt==='string'?txt:String(txt)},{quoted:m});
            m.download=async()=>await downloadMediaMessage(m,'buffer',{},{logger:pino({level:"silent"}),reuploadRequest:sock.updateMediaMessage});

            console.log(chalk.green(`▶️ ${rawCmd} ${sender.split('@')[0]} admin:${isSenderAdmin} botAdmin:${isBotAdmin}`));

            // === FIX 1: CORRECT DISPATCH ===
            const execFn = typeof plugin === 'function' ? plugin : plugin.execute;
            if(typeof execFn !== 'function') continue;
            try{
              if(plugin.isWolfStyle || execFn.length===3){
                await execFn(sock, m, {command:cmdName, text:args.join(' '), args, reply:m.reply, isOwner:m.isOwner, isAdmin:m.isAdmin, isBotAdmin:m.isBotAdmin, prefix, sock, from, sender, getGroup, groupMetadata:meta});
              } else {
                await execFn(m, {sock, prefix, args, command:cmdName, text:args.join(' '), config, plugins:global.plugins, from, sender, getGroup, isOwner:m.isOwner, isAdmin:m.isAdmin, isBotAdmin:m.isBotAdmin, groupMetadata:meta, participants, reply:m.reply});
              }
            }catch(dispatchErr){
              console.log(chalk.yellow(`Retry other style ${rawCmd}: ${dispatchErr.message}`));
              try{
                if(plugin.isWolfStyle || execFn.length===3){
                  await execFn(m, {sock, prefix, args, command:cmdName, text:args.join(' '), config, plugins:global.plugins, from, sender, getGroup, isOwner:m.isOwner, isAdmin:m.isAdmin, isBotAdmin:m.isBotAdmin, groupMetadata:meta, reply:m.reply});
                } else {
                  await execFn(sock, m, {command:cmdName, text:args.join(' '), args, reply:m.reply, isOwner:m.isOwner, isAdmin:m.isAdmin, isBotAdmin:m.isBotAdmin, prefix});
                }
              }catch(e2){ console.log(chalk.red(`Exec err ${rawCmd}: ${e2.message}`)); }
            }
          }catch(e){ console.log(chalk.red(`Exec err one msg: ${e.message}`)); }
        }
      }catch(e){ console.log(chalk.red(`Exec err: ${e.message} ${e.stack}`)); }
    });
  }
  await initBaileys();
}

module.exports={startConnection};
module.exports.AlphaOmegaConnection=startConnection;

if(require.main===module){
  startConnection().catch(e=>{ console.log(e.message); setTimeout(()=>startConnection(), 3000); });
                                                  }
