// 🩺 SIMON MD - FINAL - RENDER ENV ONLY - WOLF CONNECTED
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

let config;
try { config = require('./settings'); } catch {
  config = { botName: "SIMON MD", ownerName: "Simon", ownerNumber: "239166265317", prefix: ".", sessionName: "session", PORT: process.env.PORT || 10000 };
}
config.ownerNumber = "239166265317";
config.botName = "🩺 SIMON MD";
config.sessionName = "session";

global.sock = null; global.isConnected = false; global.connectionStatus = '⚠️ NOT LINKED'; global.pairingCode = null; global.currentPairingNumber = null; global.lastPairTime = 0; global.appStarted = false;
let lastGeneratedSession = null;

global.db = global.db || {};
global.db.groups = global.db.groups || {};
global.db.settings = global.db.settings || { prefix: ".", mode: "public", autoread: false, autostatus: true, autovv: true, autolike: false, autoreact: false, autotyping: false, autopresence: false, autoreply: false, anticall: true };
global.db.banned = global.db.banned || [];
global.db.warnings = global.db.warnings || {};
global.db.messages = global.db.messages || {};
global.db.spam = global.db.spam || {};
global.db.sudo = global.db.sudo || [config.ownerNumber + '@s.whatsapp.net', "239166265317@s.whatsapp.net"];

function getGroup(jid){
  global.db.groups[jid] = global.db.groups[jid] || { antilink:false, antibot:false, antispam:false, antiviewonce:true, antidelete:true, welcome:false, goodbye:false, welcomeText:"", goodbyeText:"" };
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
  function rd(dir){ 
    const items=fs.readdirSync(dir); 
    for(const it of items){ 
      const full=path.join(dir,it); 
      const st=fs.statSync(full); 
      if(st.isDirectory()) rd(full); 
      else if(it.endsWith('.js')){ 
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
                global.wolfCommands[clean.replace(/[^a-z0-9]/g,'')]=pl.execute;
              }
              t++;
            }
          } 
        }catch(e){ console.log(`Load err ${it}: ${e.message}`)} 
      } 
    } 
  } 
  rd(pPath); 
  console.log(chalk.green(`✅ SIMON WIRED ${t} files | ${Object.keys(global.wolfCommands).length} CMDS from ${pPath}`)); 
}
loadPlugins();

const groupCache=new Map();

// 🔥 HANDLE SESSION FROM RENDER ENV - FIXED FOR FOREVER ONLINE
function handleSessionEnv(){
  const authPath=`./${config.sessionName}`;
  try{
    let sessionEnv = process.env.SESSION_DATA || process.env.SESSION_ID || process.env.SESSION || config.SESSION_ID || "";
    if(!sessionEnv) return false;
    if(fs.existsSync(path.join(authPath,'creds.json')) && fs.statSync(path.join(authPath,'creds.json')).size>100) return true;
    
    sessionEnv = sessionEnv.trim();
    // Remove WOLF~ prefix if exists
    if(sessionEnv.startsWith('WOLF~')) sessionEnv = sessionEnv.split('~')[1];
    
    let decoded = "";
    try{
      decoded = Buffer.from(sessionEnv, 'base64').toString('utf-8');
      // Double base64 check
      if(!decoded.trim().startsWith('{')){
        try{ decoded = Buffer.from(decoded, 'base64').toString('utf-8'); }catch{}
      }
    }catch{
      decoded = sessionEnv;
    }
    
    if(!decoded.trim().startsWith('{')){
      console.log(chalk.red('❌ SESSION_DATA invalid - not JSON'));
      return false;
    }
    
    if(!fs.existsSync(authPath)) fs.mkdirSync(authPath,{recursive:true});
    const data = JSON.parse(decoded);
    fs.writeFileSync(path.join(authPath,'creds.json'), JSON.stringify(data,null,2));
    console.log(chalk.green.bold('✅ SESSION_DATA loaded from Render ENV - Forever online!'));
    return true;
  }catch(e){
    console.log(chalk.red('Session ENV error: '+e.message));
    return false;
  }
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
      res.send(`<h1>🩺 SIMON MD</h1><p>Owner: 239166265317</p><p>CMDS: ${Object.keys(global.wolfCommands).length}</p>`);
    });
    app.get('/health',(req,res)=>res.send('SIMON LIVE'));
    app.get('/api/status',(req,res)=>res.json({ botName:"SIMON MD", owner:"239166265317", status:global.connectionStatus, isConnected:global.isConnected, pairingCode:global.pairingCode, plugins:Object.keys(global.wolfCommands).length, session: lastGeneratedSession ? 'generated' : 'none', hasEnv: !!(process.env.SESSION_DATA||process.env.SESSION_ID) }));
    
    app.post('/api/pair',async(req,res)=>{
      try{
        let phone=(req.body.phone||req.body.number||'').replace(/[^0-9]/g,''); 
        if(phone.length<10) return res.json({success:false,message:'Enter valid number'});
        if(!global.sock) return res.json({success:false,message:'Bot starting... wait 5 sec'});
        if(global.isConnected) return res.json({success:false,message:'Already linked!'});
        const code=await global.sock.requestPairingCode(phone); 
        global.pairingCode=code; 
        global.currentPairingNumber=phone;
        global.connectionStatus=`CODE: ${code}`; 
        console.log(chalk.yellow(`🔑 SIMON CODE ${phone}: ${code}`)); 
        res.json({success:true,code});
      }catch(e){ res.json({success:false,message:e.message}); }
    });
    
    app.get('/getcode',async(req,res)=>{
      try{
        let phone=(req.query.number||req.query.phone||'').replace(/[^0-9]/g,'');
        if(!phone) return res.json({success:false,message:'Add ?number=239166265317'});
        if(!global.sock) return res.json({success:false,message:'Bot starting... wait 5 sec'});
        if(global.isConnected) return res.json({success:false,message:'Already linked!'});
        const code=await global.sock.requestPairingCode(phone);
        global.pairingCode=code;
        global.currentPairingNumber=phone;
        global.connectionStatus=`CODE: ${code}`;
        console.log(chalk.green.bold(`🔑 SIMON CODE ${phone}: ${code}`));
        res.json({success:true, code, phone, codeFormatted: code.match(/.{1,4}/g)?.join("-")});
      }catch(e){ res.json({success:false,message:e.message}); }
    });

    app.post('/api/logout',async(req,res)=>{ try{ if(global.sock) await global.sock.logout().catch(()=>{}); }catch{} try{ fs.rmSync(`./${config.sessionName}`,{recursive:true,force:true}); }catch{} global.sock=null; global.isConnected=false; lastGeneratedSession=null; res.json({success:true}); setTimeout(()=>initBaileys(),2000); });
    
    const PORT=config.PORT||process.env.PORT||10000; 
    app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 SIMON Dashboard ${PORT} | ${Object.keys(global.wolfCommands).length} CMDS`))); 
    global.appStarted=true;
  }

  async function initBaileys(){
    handleSessionEnv();
    const {state,saveCreds}=await useMultiFileAuthState(`./${config.sessionName}`); const {version}=await fetchLatestBaileysVersion();
    const sock=makeWASocket({ version, logger:pino({level:'silent'}), printQRInTerminal:false, browser:Browsers.macOS('Safari'), auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))}, markOnlineOnConnect:true, connectTimeoutMs:60000, keepAliveIntervalMs:10000, syncFullHistory:false, retryRequestDelayMs:2000 });
    global.sock=sock; sock.ev.on('creds.update',saveCreds);

    sock.ev.on('call',async(calls)=>{ for(let c of calls){ try{ if(global.db.settings.anticall) await sock.rejectCall(c.id,c.from); }catch{} } });

    sock.ev.on('connection.update',async(update)=>{
      const {connection,lastDisconnect}=update;
      if(connection==='connecting') global.connectionStatus='Connecting SIMON...';
      if(connection==='open'){
        try{
          if(fs.existsSync(`./${config.sessionName}/creds.json`)){
            const b=fs.readFileSync(`./${config.sessionName}/creds.json`);
            const s='WOLF~'+Buffer.from(b).toString('base64');
            lastGeneratedSession=s;
            console.log(chalk.green.bold(`\n✅ WOLF~ SESSION GENERATED:\n${s.substring(0,80)}...\n`));
          }
        }catch(e){ console.log('Session gen err', e.message); }

        global.isConnected=true; global.connectionStatus='ONLINE ✅ SIMON'; console.log(chalk.green.bold(`\n✅ SIMON ONLINE! ${Object.keys(global.wolfCommands).length} CMDS\n`)); loadPlugins();
        try{
          const jid=sock.user.id;
          if(lastGeneratedSession && !process.env.SESSION_DATA && !process.env.SESSION_ID){
            await sock.sendMessage(jid,{text:`✅ *WOLF XMD LINKED - COPY SESSION FOR RENDER*\n\n*Your WOLF~ Session (for forever online):*\n\n${lastGeneratedSession}\n\n*STEPS FOR FOREVER ONLINE:*\n1. Copy this WOLF~ code\n2. Go to Render Dashboard (dashboard.render.com)\n3. Your Service > Environment\n4. Add Variable: SESSION_DATA\n5. Paste WOLF~ as value\n6. Save Changes > Manual Deploy > Deploy\n7. Bot will be ONLINE forever!\n\nDon't paste in normal dashboard - Use Render ENV!`}).catch(()=>{});
            await sock.sendMessage(jid,{text: lastGeneratedSession}).catch(()=>{});
          } else {
            await sock.sendMessage(jid,{text:`✅ *SIMON MD ONLINE FOREVER*\n\n👤 ${sock.user.name||'SIMON MD'}\n🔣 Prefix: .\n⚡ ${Object.keys(global.wolfCommands).length} CMDS\n\nType .menu`}).catch(()=>{});
          }
        }catch{}
      }
      if(connection==='close'){
        const code=lastDisconnect?.error?.output?.statusCode; console.log(chalk.red(`❌ Closed ${code}`)); global.isConnected=false; global.sock=null; groupCache.clear();
        if([DisconnectReason.loggedOut,401,440,405].includes(code)){ try{ fs.rmSync(`./${config.sessionName}`,{recursive:true,force:true}); }catch{} global.connectionStatus='LOGGED OUT'; setTimeout(()=>initBaileys(),3000); }
        else{ global.connectionStatus='Reconnecting SIMON...'; setTimeout(()=>initBaileys(),5000); }
      }
    });

    sock.ev.on('messages.upsert',async({messages,type})=>{
      try{
        if(type!=='notify') return; const m=messages[0]; if(!m?.message) return; const from=m.key.remoteJid;
        if(from==='status@broadcast'){ if(global.db.settings.autostatus){ await sock.readMessages([m.key]).catch(()=>{}); } return; }
        const sender=m.key.participant||from; const isGroup=from.endsWith('@g.us'); const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||"";
        if(m.key.id){ global.db.messages[m.key.id]={text:body,sender,from,time:Date.now(), message:m.message}; if(Object.keys(global.db.messages).length>150) delete global.db.messages[Object.keys(global.db.messages)[0]]; }
        if(!body) return; const prefix=global.db.settings.prefix||config.prefix||'.'; if(!body.trim().startsWith(prefix)) return;
        const args=body.trim().slice(prefix.length).trim().split(/ +/); const rawCmd=args.shift()?.toLowerCase(); if(!rawCmd) return;
        const cmdName=rawCmd.replace(/[^a-z0-9]/g,'')||rawCmd;
        let plugin = global.plugins.get(rawCmd) || global.plugins.get(cmdName) || global.wolfCommands[rawCmd] || global.wolfCommands[cmdName];
        if(!plugin){ const fn = global.wolfCommands[rawCmd] || global.wolfCommands[cmdName]; if(fn && typeof fn === 'function'){ plugin = { execute: fn, isWolfStyle: true }; } }
        if(!plugin) return; 
        if(global.db.banned.includes(sender)) return;
        m.body=body; m.text=args.join(' '); m.args=args; m.sender=sender; m.chat=from; m.from=from; m.isGroup=isGroup; m.fromMe=m.key.fromMe; m.pushName=m.pushName||"User"; 
        m.isOwner=sender.includes('239166265317') || global.db.sudo.includes(sender) || m.key.fromMe;
        m.reply=async(txt)=>await sock.sendMessage(from,{text:txt},{quoted:m});
        m.download=async()=>await downloadMediaMessage(m,'buffer',{},{logger:pino({level:"silent"}),reuploadRequest:sock.updateMediaMessage});
        console.log(chalk.green(`▶️ ${rawCmd} ${sender.split('@')[0]}`));
        if(plugin.isWolfStyle || typeof plugin === 'function' || plugin.execute.length===3 || global.wolfCommands[rawCmd]){
          const execFn = typeof plugin === 'function' ? plugin : (plugin.execute || global.wolfCommands[rawCmd] || global.wolfCommands[cmdName]);
          if(typeof execFn === 'function'){ await execFn(sock, m, {command:cmdName, text:args.join(' '), args, reply:m.reply, isOwner:m.isOwner, prefix}); }
        } else { await plugin.execute(m,{sock,prefix,args,command:cmdName,config,plugins:global.plugins,from,sender,getGroup}); }
      }catch(e){ console.log(chalk.red(`Exec err: ${e.message}`)); }
    });
  }
  await initBaileys();
}

module.exports={startConnection};
module.exports.SimonMDConnection=startConnection;
if(require.main===module){ startConnection().catch(e=>{ console.log(e.message); setTimeout(()=>startConnection(), 3000); }); }
