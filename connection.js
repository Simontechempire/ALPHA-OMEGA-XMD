// 🐺 ALPHA AND OMEGA WOLF XMD - CONNECTION.JS - TYPE 2 RENDER DASHBOARD EDITION
// Owner: 239166265317 | Simon Tech Inc | TYPE 2 = SESSION_ID from ENV
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
const settings = require('./settings');

// WOLF CONFIG - TYPE 2
let config = settings;
global.sock = null;
global.isConnected = false;
global.connectionStatus = '⚠️ WAITING FOR SESSION_ID';
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

global.plugins=new Map();
global.wolfCommands={};

function loadPlugins(){ 
  const pPath = path.join(__dirname,'plugins');
  if(!fs.existsSync(pPath)) { console.log(chalk.red('No plugins folder found')); return; }
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
              if(pl.alias) for(const a of pl.alias) { global.plugins.set(a.toLowerCase(),pl); global.wolfCommands[a.toLowerCase()]=pl.execute; }
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
  console.log(chalk.green(`✅ WOLF TYPE 2 WIRED ${t} files | ${Object.keys(global.wolfCommands).length} CMDS`)); 
}

const groupCache=new Map();
async function getCachedMeta(sock,jid){
  const c=groupCache.get(jid); if(c && Date.now()-c.time<90000) return c.meta;
  try{ const meta=await sock.groupMetadata(jid); groupCache.set(jid,{meta,time:Date.now()}); if(groupCache.size>50) groupCache.delete(groupCache.keys().next().value); return meta; }catch{ return null; }
}

// ===== TYPE 2 SESSION HANDLER - Reads SESSION_ID from ENV =====
async function handleSessionId() {
  const sessionPath = './session';
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

  const sessionId = process.env.SESSION_ID || settings.SESSION_ID;

  if (!sessionId) {
    console.log(chalk.red.bold("\n❌ [WOLF TYPE 2] SESSION_ID MISSING!"));
    console.log(chalk.yellow("Go to Render Dashboard -> Environment -> SESSION_ID"));
    console.log(chalk.yellow("Paste your WOLF~... session there and redeploy.\n"));
    return false;
  }

  // If creds already exists, skip
  if (fs.existsSync(path.join(sessionPath, 'creds.json')) && fs.statSync(path.join(sessionPath, 'creds.json')).size > 100) {
    console.log(chalk.green("[WOLF TYPE 2] Session already exists, using it."));
    return true;
  }

  console.log(chalk.cyan("[WOLF TYPE 2] Decoding SESSION_ID..."));

  try {
    let data;
    let cleanId = sessionId.trim();

    // Support WOLF~ prefix
    if (cleanId.startsWith('WOLF~') || cleanId.startsWith('ALPHA~') || cleanId.includes('~')) {
      cleanId = cleanId.split('~')[1] || cleanId;
    }

    // Support MEGA link
    if (cleanId.includes('mega.nz') || cleanId.includes('mega.co.nz')) {
      console.log(chalk.yellow("[WOLF TYPE 2] MEGA link detected, downloading..."));
      const { File } = require('megajs');
      const file = File.fromURL(cleanId);
      await new Promise((resolve, reject) => {
        file.loadAttributes((err) => {
          if (err) return reject(err);
          file.download((err, bufferData) => {
            if (err) return reject(err);
            try {
              const json = JSON.parse(bufferData.toString());
              data = json;
              fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(json, null, 2));
              console.log(chalk.green("[WOLF TYPE 2] MEGA session saved!"));
              resolve();
            } catch (e) { reject(e); }
          });
        });
      });
      return true;
    }

    // Try base64 JSON
    try {
      let decoded = Buffer.from(cleanId, 'base64').toString('utf-8');
      // Sometimes double base64
      if (decoded.startsWith('eyJ') || decoded.startsWith('{')) {
        data = JSON.parse(decoded);
      } else {
        // Try second decode
        try {
          let second = Buffer.from(decoded, 'base64').toString('utf-8');
          data = JSON.parse(second);
        } catch {
          data = JSON.parse(decoded);
        }
      }
      fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(data, null, 2));
      console.log(chalk.green("[WOLF TYPE 2] Base64 SESSION_ID decoded and saved!"));
      return true;
    } catch (e) {
      console.log(chalk.red("[WOLF TYPE 2] Base64 decode failed: " + e.message));
      // Try raw JSON
      try {
        data = JSON.parse(cleanId);
        fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(data, null, 2));
        console.log(chalk.green("[WOLF TYPE 2] Raw JSON session saved!"));
        return true;
      } catch {
        console.log(chalk.red("[WOLF TYPE 2] Invalid SESSION_ID format! Should be WOLF~base64 or JSON"));
        return false;
      }
    }
  } catch (e) {
    console.log(chalk.red("[WOLF TYPE 2] Session handling error: " + e.message));
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
      res.send(`
        <h1>🐺 ALPHA AND OMEGA WOLF XMD - TYPE 2</h1>
        <p>Owner: ${settings.ownerName} - ${settings.ownerNumber}</p>
        <p>Status: ${global.connectionStatus}</p>
        <p>Connected: ${global.isConnected}</p>
        <p>Mode: ${settings.mode} | Prefix: ${settings.prefix}</p>
        <p>CMDS: ${Object.keys(global.wolfCommands).length}</p>
        <p>Session: ${process.env.SESSION_ID ? 'FOUND ✓' : 'MISSING ✗'}</p>
        <hr>
        <p><a href="/api/status">API Status</a></p>
        <p>This is MAIN BOT, not Pair Site. Pair Site is separate deployment.</p>
      `);
    });
    app.get('/health',(req,res)=>res.send('WOLF TYPE 2 LIVE'));
    app.get('/api/status',(req,res)=>res.json({ 
      botName: settings.botName, 
      owner: settings.ownerNumber, 
      status: global.connectionStatus, 
      isConnected: global.isConnected, 
      mode: settings.mode,
      prefix: settings.prefix,
      plugins: Object.keys(global.wolfCommands).length,
      type: "TYPE 2 - SESSION_ID ENV",
      sessionFound: !!process.env.SESSION_ID
    }));
    
    // Main bot should not handle pairing, but we keep endpoint for info
    app.get('/getcode',(req,res)=>{
      res.json({ success: false, message: 'This is MAIN BOT (Type 2). This bot uses SESSION_ID from Dashboard ENV. Pairing is done on separate Pair Site deployment. Go to your Pair Site URL to get WOLF~ session.' });
    });

    const PORT=settings.port||process.env.PORT||10000; 
    app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 WOLF TYPE 2 Dashboard http://0.0.0.0:${PORT} | ${Object.keys(global.wolfCommands).length} CMDS | MODE: ${settings.mode}`))); 
    global.appStarted=true;
  }

  // ===== HANDLE SESSION_ID BEFORE BAILEYS =====
  const sessionReady = await handleSessionId();
  if (!sessionReady) {
    console.log(chalk.yellow("[WOLF TYPE 2] Waiting 10s for ENV fix, then retrying..."));
    setTimeout(() => startConnection(), 10000);
    return;
  }

  async function initBaileys(){
    try{
      const authPath=`./session`;
      if (!fs.existsSync(authPath)) fs.mkdirSync(authPath, { recursive: true });

      const {state,saveCreds}=await useMultiFileAuthState(authPath); 
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
        retryRequestDelayMs:2000 
      });
      
      global.sock=sock; 
      sock.ev.on('creds.update',saveCreds);

      // Anti-call from dashboard
      sock.ev.on('call',async(calls)=>{ 
        for(let c of calls){ 
          try{ 
            if(settings.auto.antiCall || global.db.settings.anticall) {
              await sock.rejectCall(c.id,c.from);
              if(settings.auto.autoReply) await sock.sendMessage(c.from, { text: "📞 Call rejected - WOLF XMD ANTI-CALL enabled" }).catch(()=>{});
            }
          }catch{} 
        } 
      });

      // Anti-delete
      sock.ev.on('messages.update',async(updates)=>{ 
        for(let up of updates){ 
          if(up.update.message===null){ 
            const saved=global.db.messages[up.key.id]; 
            if(!saved) continue; 
            const g=getGroup(saved.from); 
            if(!g.antidelete) continue; 
            try{ 
              if(settings.auto.antiDelPath === 'log') {
                const ownerJid = settings.ownerNumber.replace(/[^0-9]/g,'') + "@s.whatsapp.net";
                await sock.sendMessage(ownerJid,{text:`*🔍 ANTI-DELETE LOG*\nFrom: ${saved.from}\nSender: @${saved.sender.split('@')[0]}\n> ${saved.text?.slice(0,300)}`,mentions:[saved.sender]}).catch(()=>{});
                await sock.sendMessage(ownerJid,{forward:saved.message}).catch(()=>{});
              } else {
                await sock.sendMessage(saved.from,{text:`*🔍 ANTI-DELETE WOLF*\nFrom: @${saved.sender.split('@')[0]}\n> ${saved.text?.slice(0,300)}`,mentions:[saved.sender]}).catch(()=>{});
                await sock.sendMessage(saved.from,{forward:saved.message}).catch(()=>{});
              }
            }catch{} 
          } 
        } 
      });

      sock.ev.on('connection.update',async(update)=>{
        const {connection,lastDisconnect}=update;
        if(connection==='connecting') global.connectionStatus='Connecting WOLF TYPE 2...';
        if(connection==='open'){
          global.isConnected=true; 
          global.connectionStatus='ONLINE ✅ WOLF TYPE 2'; 
          console.log(chalk.green.bold(`\n✅ WOLF TYPE 2 ONLINE! ${Object.keys(global.wolfCommands).length} CMDS | MODE: ${settings.mode}\n`)); 
          loadPlugins();
          // Load main handler with TYPE 2 features
          try {
            const mainHandler = require('./main.js');
            await mainHandler(sock);
            console.log(chalk.green("✅ main.js TYPE 2 loaded with dashboard ENV features"));
          } catch (e) {
            console.log(chalk.red("main.js load error: " + e.message));
          }

          // Auto Bio if enabled in dashboard
          if(settings.auto.autoBio || global.db.settings.autobio) {
            setInterval(async () => {
              try {
                const now = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
                const bio = (settings.auto.autobioText || global.db.settings.autobioText || '🐺 WOLF XMD | {time}').replace('{time}', now);
                await sock.updateProfileStatus(bio).catch(()=>{});
              } catch {}
            }, 60000);
          }

          try{ 
            const jid=sock.user.id; 
            await sock.sendMessage(jid,{text:`✅ *WOLF XMD TITAN TYPE 2 LINKED*\n\n👤 ${sock.user.name||'ALPHA'}\n🔣 Prefix: ${settings.prefix}\n🌐 Mode: ${settings.mode}\n⚡ ${Object.keys(global.wolfCommands).length} CMDS\n✅ Dashboard ENV synced\n\nType ${settings.prefix}menu - Owner ${settings.ownerNumber}\n\n🐺 ALPHA AND OMEGA`}).catch(()=>{}); 
          }catch{}
        }
        if(connection==='close'){
          const code=lastDisconnect?.error?.output?.statusCode; 
          console.log(chalk.red(`❌ Closed ${code} | ${lastDisconnect?.error?.message}`)); 
          global.isConnected=false; 
          global.sock=null; 
          groupCache.clear();
          if([DisconnectReason.loggedOut,401,440,405].includes(code)){ 
            try{ fs.rmSync(`./session`,{recursive:true,force:true}); }catch{} 
            global.connectionStatus='LOGGED OUT - Delete session folder and get new WOLF~ session from Pair Site'; 
            console.log(chalk.red.bold("LOGGED OUT! Get new SESSION_ID from Pair Site"));
          }
          else{ 
            global.connectionStatus='Reconnecting WOLF TYPE 2...'; 
            setTimeout(()=>initBaileys(),5000); 
          }
        }
      });

      // The main message handler is in main.js now (TYPE 2), but we keep backup anti-delete cache
      sock.ev.on('messages.upsert',async({messages,type})=>{
        try{
          if(type!=='notify') return; 
          const m=messages[0]; 
          if(!m?.message) return; 
          const from=m.key.remoteJid;
          if(from==='status@broadcast') return;
          const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.videoMessage?.caption||"";
          if(m.key.id){ 
            global.db.messages[m.key.id]={text:body,sender:m.key.participant||from,from,time:Date.now(), message:m.message}; 
            if(Object.keys(global.db.messages).length>200) delete global.db.messages[Object.keys(global.db.messages)[0]]; 
          }
        }catch(e){}
      });

    } catch(e) {
      console.log(chalk.red("initBaileys error: " + e.message));
      setTimeout(()=>initBaileys(),5000);
    }
  }
  await initBaileys();
}

module.exports={startConnection};
module.exports.AlphaOmegaConnection=startConnection;

if(require.main===module){
  startConnection().catch(e=>{ console.log(e.message); setTimeout(()=>startConnection(), 3000); });
  }
