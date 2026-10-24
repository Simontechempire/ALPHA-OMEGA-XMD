// 🐺 WOLF XMD - FINAL FIX FOR VYLW46PW / Connection Closed
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino'); const chalk = require('chalk'); const express = require('express'); const path = require('path'); const fs = require('fs'); const settings = require('./settings');

global.sock=null; global.isConnected=false; global.connectionStatus='STARTING...'; global.appStarted=false;
global.db=global.db||{}; global.db.groups=global.db.groups||{}; global.db.settings=global.db.settings||{prefix:settings.prefix||".",mode:settings.mode||"public",...settings.auto};
global.db.messages={}; global.plugins=new Map(); global.wolfCommands={};
function loadPlugins(){ const pPath=path.join(__dirname,'plugins'); if(!fs.existsSync(pPath)) return; global.plugins.clear(); global.wolfCommands={}; let t=0; function rd(dir){ const items=fs.readdirSync(dir); for(const it of items){ const full=path.join(dir,it); const st=fs.statSync(full); if(st.isDirectory()) rd(full); else if(it.endsWith('.js')){ try{ delete require.cache[require.resolve(full)]; const d=require(full); const arr=Array.isArray(d)?d:[d]; for(const pl of arr){ if(pl&&pl.name&&pl.execute){global.plugins.set(pl.name.toLowerCase(),pl); global.wolfCommands[pl.name.toLowerCase()]=pl.execute; t++;} else if(pl&&pl.command&&pl.execute){for(const cmd of pl.command){global.plugins.set(cmd.toLowerCase(),pl); global.wolfCommands[cmd.toLowerCase()]=pl.execute; } t++;}}}catch{}}}} rd(pPath); console.log(chalk.green(`✅ WIRED ${t} files | ${Object.keys(global.wolfCommands).length} CMDS`)); }

let lastGeneratedSession=null;
let activePairSocket=null;
let activePairNumber=null;

async function handleSessionId(){
  const sp='./session'; if(!fs.existsSync(sp)) fs.mkdirSync(sp,{recursive:true});
  const sid=process.env.SESSION_ID||settings.SESSION_ID; if(!sid) return false;
  if(fs.existsSync(path.join(sp,'creds.json')) && fs.statSync(path.join(sp,'creds.json')).size>100) return true;
  try{ let clean=sid.trim(); if(clean.includes('~')) clean=clean.split('~')[1]; let dec=Buffer.from(clean,'base64').toString('utf-8'); if(!dec.trim().startsWith('{')){ try{ dec=Buffer.from(dec,'base64').toString('utf-8'); }catch{} } const data=JSON.parse(dec); fs.writeFileSync(path.join(sp,'creds.json'), JSON.stringify(data,null,2)); console.log(chalk.green("[WOLF] SESSION_ID decoded!")); return true; }catch(e){ console.log(chalk.red("Decode fail "+e.message)); return false; }
}

async function startConnection(){
  if(!global.appStarted){
    const app=express(); app.use(express.json()); app.use(express.urlencoded({extended:true})); app.use(express.static(__dirname));
    app.get('/',(req,res)=>{ const idx=path.join(__dirname,'index.html'); if(fs.existsSync(idx)) return res.sendFile(idx); res.send('<h1>WOLF TYPE2</h1>'); });
    app.get('/health',(req,res)=>res.send('OK'));
    app.get('/api/status',(req,res)=>res.json({status:global.connectionStatus, connected:global.isConnected, session:!!process.env.SESSION_ID, lastSession: lastGeneratedSession ? 'yes':'no'}));

    // 🔥 FIXED GETCODE - NO MORE VYLW46PW
    app.get('/getcode', async (req,res)=>{
      const number=req.query.number?.replace(/[^0-9]/g,''); if(!number) return res.json({error:'Enter number'});
      if(global.isConnected) return res.json({error:'Bot already online'});
      try{
        // Close old pair socket if exists
        if(activePairSocket){ try{ activePairSocket.end(); }catch{} activePairSocket=null; }
        // Clean session for new pairing
        if(fs.existsSync('./session')){ try{ fs.rmSync('./session',{recursive:true,force:true}); }catch{} }
        await new Promise(r=>setTimeout(r,1000));
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        const { version } = await fetchLatestBaileysVersion();
        const sock = makeWASocket({ version, logger:pino({level:'silent'}), printQRInTerminal:false, browser:Browsers.macOS('Desktop'), auth:{creds:state.creds, keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))} });
        activePairSocket=sock; activePairNumber=number;
        sock.ev.on('creds.update', saveCreds);
        
        // IMPORTANT: Wait 2s before requesting code - fixes Connection Closed
        await new Promise(r=>setTimeout(r,2000));
        
        if(!sock.authState.creds.registered){
          const code = await sock.requestPairingCode(number);
          console.log(chalk.green(`[PAIR] ${number} => ${code}`));
          
          sock.ev.on('connection.update', async (u)=>{
            if(u.connection==='open'){
              await new Promise(r=>setTimeout(r,3000));
              if(fs.existsSync('./session/creds.json')){
                try{
                  const creds=fs.readFileSync('./session/creds.json');
                  const sess='WOLF~'+Buffer.from(creds).toString('base64');
                  lastGeneratedSession=sess;
                  console.log(chalk.green.bold(`\n✅ SESSION: ${sess.substring(0,60)}...\n`));
                  try{ const jid=number+'@s.whatsapp.net'; await sock.sendMessage(jid,{text:`🐺 *WOLF XMD SESSION*\n\n✅ Paired!\n\nSESSION_ID:\n${sess}\n\n1. Copy\n2. Render ENV -> SESSION_ID\n3. Paste & Deploy`}); await sock.sendMessage(jid,{text:sess}); }catch(e){console.log('DM fail '+e.message)}
                  global.connectionStatus='PAIRED! Check DM';
                }catch(e){console.log(e.message)}
              }
            }
            if(u.connection==='close'){
              const reason=u.lastDisconnect?.error?.output?.statusCode;
              console.log(chalk.yellow(`Pair socket closed ${reason}`));
            }
          });
          
          return res.json({code: code});
        } else {
          return res.json({error:'Already registered - delete session folder'});
        }
      }catch(err){
        console.log(chalk.red('[GETCODE ERROR] '+err.message));
        // Specific fix for VYLW46PW
        if(err.message.includes('Connection Closed') || err.message.includes('VYLW')){
          return res.json({error:'Connection Closed - Try again in 10 seconds. Make sure number is correct with country code and not already linked.'});
        }
        return res.json({error: err.message});
      }
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
      try{ lastGeneratedSession=sessionId; if(!fs.existsSync('./session')) fs.mkdirSync('./session',{recursive:true}); let clean=sessionId.split('~')[1]; let dec=Buffer.from(clean,'base64').toString('utf-8'); if(!dec.trim().startsWith('{')) dec=Buffer.from(dec,'base64').toString('utf-8'); const data=JSON.parse(dec); fs.writeFileSync('./session/creds.json', JSON.stringify(data,null,2)); console.log(chalk.green("✅ Deployed via dashboard")); res.json({success:true}); setTimeout(()=>{ handleSessionId().then(()=>{}); },1000); }catch(e){ res.json({error:e.message}); }
    });

    const PORT=settings.port||process.env.PORT||10000; app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 WOLF http://0.0.0.0:${PORT}`))); global.appStarted=true;
  }

  const hasSession=await handleSessionId(); if(!hasSession){ console.log(chalk.yellow.bold("\n⚠️ PAIR MODE - Open URL to pair!\n")); global.connectionStatus='PAIR MODE'; return; }
  console.log(chalk.green("Starting MAIN BOT..."));
  async function initBaileys(){
    try{
      const {state,saveCreds}=await useMultiFileAuthState('./session'); const {version}=await fetchLatestBaileysVersion();
      const sock=makeWASocket({version, logger:pino({level:'silent'}), printQRInTerminal:false, browser:Browsers.macOS('Safari'), auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))}});
      global.sock=sock; sock.ev.on('creds.update',saveCreds);
      sock.ev.on('connection.update',async(update)=>{
        const {connection,lastDisconnect}=update;
        if(connection==='open'){ global.isConnected=true; global.connectionStatus='ONLINE ✅'; console.log(chalk.green.bold(`\n✅ WOLF ONLINE!\n`)); loadPlugins(); try{ const h=require('./main.js'); await h(sock); }catch(e){ console.log(e.message)} }
        if(connection==='close'){ const code=lastDisconnect?.error?.output?.statusCode; console.log(chalk.red(`Closed ${code}`)); global.isConnected=false; if([401,440,405].includes(code)){ try{ fs.rmSync('./session',{recursive:true,force:true}); }catch{} lastGeneratedSession=null; global.connectionStatus='LOGGED OUT'; } else setTimeout(()=>initBaileys(),5000); }
      });
    }catch(e){ console.log(e.message); setTimeout(()=>initBaileys(),5000); }
  }
  await initBaileys();
}
module.exports={startConnection}; if(require.main===module){ startConnection(); }
