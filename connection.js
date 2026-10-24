// 🐺 ALPHA AND OMEGA WOLF XMD - CONNECTION.JS - TYPE 2 HYBRID - FINAL
// Owner: 239166265317 | Simon Tech Inc | TYPE 2 = Pair Site + Main Bot in ONE
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const fs = require('fs');
const settings = require('./settings');

global.sock = null;
global.isConnected = false;
global.connectionStatus = 'STARTING...';
global.appStarted = false;
global.db = global.db || {};
global.db.groups = global.db.groups || {};
global.db.settings = global.db.settings || { 
  prefix: settings.prefix || ".", 
  mode: settings.mode || "public",
  ...settings.auto
};
global.db.banned = global.db.banned || [];
global.db.warnings = global.db.warnings || {};
global.db.messages = global.db.messages || {};
global.db.spam = global.db.spam || {};
global.db.sudo = global.db.sudo || [settings.ownerNumber + '@s.whatsapp.net', "239166265317@s.whatsapp.net", ...settings.extraOwners.map(n=> n+"@s.whatsapp.net")];

function getGroup(jid){
  global.db.groups[jid] = global.db.groups[jid] || { antilink: settings.auto.antiLink, antibot:false, antispam: settings.auto.antiSpam, antiviewonce:true, antidelete: settings.auto.antidelete, welcome: settings.auto.welcome, goodbye:false };
  return global.db.groups[jid];
}
global.plugins=new Map(); global.wolfCommands={};
function loadPlugins(){ 
  const pPath = path.join(__dirname,'plugins');
  if(!fs.existsSync(pPath)) return;
  global.plugins.clear(); global.wolfCommands={}; let t=0; 
  function rd(dir){ 
    const items=fs.readdirSync(dir); 
    for(const it of items){ 
      const full=path.join(dir,it); const st=fs.statSync(full); 
      if(st.isDirectory()) rd(full); 
      else if(it.endsWith('.js')){ 
        try{ delete require.cache[require.resolve(full)]; const d=require(full); const arr=Array.isArray(d)?d:[d]; 
          for(const pl of arr){ if(pl&&pl.name&&pl.execute){global.plugins.set(pl.name.toLowerCase(),pl); global.wolfCommands[pl.name.toLowerCase()]=pl.execute; if(pl.alias) for(const a of pl.alias) { global.plugins.set(a.toLowerCase(),pl); global.wolfCommands[a.toLowerCase()]=pl.execute; } t++; } else if(pl&&pl.command&&pl.execute){ for(const cmd of pl.command){ const clean=cmd.toLowerCase(); global.plugins.set(clean, pl); global.wolfCommands[clean]=pl.execute; global.wolfCommands[clean.replace(/[^a-z0-9]/g,'')]=pl.execute; } t++; } } 
        }catch(e){} 
      } 
    } 
  } 
  rd(pPath); console.log(chalk.green(`✅ WOLF WIRED ${t} files | ${Object.keys(global.wolfCommands).length} CMDS`)); 
}
const groupCache=new Map();

let lastGeneratedSession = null;
let tempSockStore = null;

async function handleSessionId() {
  const sessionPath = './session';
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });
  const sessionId = process.env.SESSION_ID || settings.SESSION_ID;
  if (!sessionId) {
    console.log(chalk.yellow("[WOLF TYPE 2] No SESSION_ID - PAIR MODE"));
    return false;
  }
  if (fs.existsSync(path.join(sessionPath, 'creds.json')) && fs.statSync(path.join(sessionPath, 'creds.json')).size > 100) {
    console.log(chalk.green("[WOLF TYPE 2] Session exists"));
    return true;
  }
  console.log(chalk.cyan("[WOLF TYPE 2] Decoding SESSION_ID..."));
  try {
    let cleanId = sessionId.trim();
    if (cleanId.startsWith('WOLF~') || cleanId.includes('~')) cleanId = cleanId.split('~')[1] || cleanId;
    if (cleanId.includes('mega.nz')) {
      console.log(chalk.yellow("MEGA detected - use pair site instead"));
      return false;
    }
    let decoded = Buffer.from(cleanId, 'base64').toString('utf-8');
    if (!decoded.trim().startsWith('{')) {
      try { decoded = Buffer.from(decoded, 'base64').toString('utf-8'); } catch {}
    }
    const data = JSON.parse(decoded);
    fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(data, null, 2));
    console.log(chalk.green("[WOLF TYPE 2] SESSION_ID decoded!"));
    return true;
  } catch (e) {
    console.log(chalk.red("[WOLF] Decode fail: "+e.message));
    return false;
  }
}

async function startConnection(){
  if(!global.appStarted){
    const app=express(); 
    app.use(express.json()); 
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname));
    
    app.get('/',(req,res)=>{
      const idx1 = path.join(__dirname,'index.html');
      if(fs.existsSync(idx1)) return res.sendFile(idx1);
      res.send(`<h1>🐺 WOLF XMD TYPE 2</h1><p>Status: ${global.connectionStatus}</p><p>Connected: ${global.isConnected}</p><p>Session: ${process.env.SESSION_ID ? 'FOUND' : 'PAIR MODE'}</p>`);
    });
    app.get('/health',(req,res)=>res.send('WOLF TYPE 2 LIVE'));
    app.get('/api/status',(req,res)=>res.json({ botName: settings.botName, status: global.connectionStatus, isConnected: global.isConnected, mode: settings.mode, type: "TYPE 2 HYBRID", sessionFound: !!process.env.SESSION_ID, lastSession: lastGeneratedSession ? 'generated' : 'none' }));
    
    // 🔥 REAL PAIR ENDPOINT - FIXED FOR YOUR HTML
    app.get('/getcode', async (req,res)=>{
      const number = req.query.number?.replace(/[^0-9]/g,'');
      if(!number) return res.json({error:'Enter number with country code'});
      if(global.isConnected) return res.json({error:'Bot already online as MAIN BOT'});
      try {
        if(fs.existsSync('./session')) fs.rmSync('./session',{recursive:true, force:true});
        lastGeneratedSession = null;
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        const sock = makeWASocket({
          logger:pino({level:'silent'}),
          printQRInTerminal:false,
          browser: Browsers.macOS('Safari'),
          auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) }
        });
        tempSockStore = sock;
        sock.ev.on('creds.update', saveCreds);
        const code = await sock.requestPairingCode(number);
        console.log(chalk.green(`[PAIR] Code for ${number}: ${code}`));

        sock.ev.on('connection.update', async (u)=>{
          if(u.connection==='open'){
            await new Promise(r=>setTimeout(r,3000));
            if(fs.existsSync('./session/creds.json')){
              try{
                const creds = fs.readFileSync('./session/creds.json');
                const sessionId = 'WOLF~' + Buffer.from(creds).toString('base64');
                lastGeneratedSession = sessionId;
                global.connectionStatus = 'PAIRED! WOLF~ Ready';
                console.log(chalk.green.bold(`\n✅ SESSION GENERATED:\n${sessionId}\n`));
                const jid = number+'@s.whatsapp.net';
                try{
                  await sock.sendMessage(jid,{text:`🐺 *WOLF XMD TYPE 2 - SESSION*\n\n✅ Paired Successfully!\n\n*YOUR SESSION_ID:*\n\`\`\`${sessionId}\`\`\`\n\n*STEPS:*\n1. Copy above\n2. Render Dashboard > Environment\n3. Add SESSION_ID\n4. Paste & Save\n5. Redeploy\n\nBot online after redeploy!`});
                  await sock.sendMessage(jid,{text: sessionId});
                }catch(e){ console.log('DM fail', e.message) }
              }catch(e){ console.log('Session gen fail', e.message) }
            }
          }
        });
        res.json({code: code});
        setTimeout(()=>{ try{ sock.end() }catch{} }, 120000);
      } catch(err){
        console.log('[GETCODE ERROR]', err.message);
        res.json({error: err.message || 'Failed to get code'});
      }
    });

    // 🔥 POLLING ENDPOINT FOR YOUR NEW HTML
    app.get('/check-session', (req,res)=>{
      if(lastGeneratedSession){
        return res.json({session: lastGeneratedSession});
      }
      if(fs.existsSync('./session/creds.json')){
        try{
          const creds = fs.readFileSync('./session/creds.json');
          if(creds.length > 100){
            const sessionId = 'WOLF~' + Buffer.from(creds).toString('base64');
            lastGeneratedSession = sessionId;
            return res.json({session: sessionId});
          }
        }catch{}
      }
      return res.json({});
    });

    const PORT=settings.port||process.env.PORT||10000; 
    app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 WOLF TYPE 2 HYBRID http://0.0.0.0:${PORT} | ${global.connectionStatus}`))); 
    global.appStarted=true;
  }

  const hasSession = await handleSessionId();
  if (!hasSession) {
    console.log(chalk.yellow.bold("\n⚠️ PAIR MODE - Open Render URL to pair!\n"));
    global.connectionStatus = 'PAIR MODE - Open URL';
    return;
  }

  console.log(chalk.green("Starting Baileys as MAIN BOT..."));
  async function initBaileys(){
    try{
      const authPath=`./session`;
      const {state,saveCreds}=await useMultiFileAuthState(authPath); 
      const {version}=await fetchLatestBaileysVersion();
      const sock=makeWASocket({ version, logger:pino({level:'silent'}), printQRInTerminal:false, browser:Browsers.macOS('Safari'), auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))}, markOnlineOnConnect:true, connectTimeoutMs:60000 });
      global.sock=sock; 
      sock.ev.on('creds.update',saveCreds);
      sock.ev.on('call',async(calls)=>{ for(let c of calls){ try{ if(settings.auto.antiCall || global.db.settings.anticall) { await sock.rejectCall(c.id,c.from); } }catch{} } });
      sock.ev.on('messages.update',async(updates)=>{ 
        for(let up of updates){ if(up.update.message===null){ const saved=global.db.messages[up.key.id]; if(!saved) continue; const g=getGroup(saved.from); if(!g.antidelete) continue; try{ if(settings.auto.antiDelPath === 'log') { const ownerJid = settings.ownerNumber.replace(/[^0-9]/g,'') + "@s.whatsapp.net"; await sock.sendMessage(ownerJid,{text:`*🔍 ANTI-DELETE*\nFrom: ${saved.from}\nSender: @${saved.sender.split('@')[0]}\n> ${saved.text?.slice(0,300)}`,mentions:[saved.sender]}).catch(()=>{}); } }catch{} } } 
      });
      sock.ev.on('connection.update',async(update)=>{
        const {connection,lastDisconnect}=update;
        if(connection==='connecting') global.connectionStatus='Connecting...';
        if(connection==='open'){
          global.isConnected=true; global.connectionStatus='ONLINE ✅ WOLF TYPE 2'; 
          console.log(chalk.green.bold(`\n✅ WOLF TYPE 2 ONLINE! ${Object.keys(global.wolfCommands).length} CMDS\n`)); 
          loadPlugins();
          try { const mainHandler = require('./main.js'); await mainHandler(sock); console.log(chalk.green("✅ main.js loaded")); } catch (e) { console.log(chalk.red("main.js error: " + e.message)); }
          try{ const jid=sock.user.id; await sock.sendMessage(jid,{text:`✅ *WOLF XMD TITAN TYPE 2 LINKED*\n\nPrefix: ${settings.prefix}\nMode: ${settings.mode}\n⚡ ${Object.keys(global.wolfCommands).length} CMDS\n\nType ${settings.prefix}menu`}).catch(()=>{}); }catch{}
        }
        if(connection==='close'){
          const code=lastDisconnect?.error?.output?.statusCode; console.log(chalk.red(`❌ Closed ${code}`)); global.isConnected=false; global.sock=null; groupCache.clear();
          if([DisconnectReason.loggedOut,401,440,405].includes(code)){ try{ fs.rmSync(`./session`,{recursive:true,force:true}); }catch{} global.connectionStatus='LOGGED OUT - Get new WOLF~'; console.log(chalk.red.bold("LOGGED OUT!")); lastGeneratedSession=null; }
          else{ global.connectionStatus='Reconnecting...'; setTimeout(()=>initBaileys(),5000); }
        }
      });
      sock.ev.on('messages.upsert',async({messages,type})=>{ try{ if(type!=='notify') return; const m=messages[0]; if(!m?.message) return; const from=m.key.remoteJid; if(from==='status@broadcast') return; const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||""; if(m.key.id){ global.db.messages[m.key.id]={text:body,sender:m.key.participant||from,from,time:Date.now(), message:m.message}; if(Object.keys(global.db.messages).length>200) delete global.db.messages[Object.keys(global.db.messages)[0]]; } }catch(e){} });
    } catch(e) { console.log(chalk.red("initBaileys error: " + e.message)); setTimeout(()=>initBaileys(),5000); }
  }
  await initBaileys();
}

module.exports={startConnection};
module.exports.AlphaOmegaConnection=startConnection;
if(require.main===module){ startConnection().catch(e=>{ console.log(e.message); setTimeout(()=>startConnection(), 3000); }); }
