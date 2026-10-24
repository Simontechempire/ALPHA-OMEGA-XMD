// 🐺 WOLF XMD - HYBRID FIX - Pair Site + Main Bot in ONE FILE
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

global.db = global.db || {};
global.db.groups = global.db.groups || {};
global.db.settings = global.db.settings || { 
  prefix: settings.prefix || ".", 
  mode: settings.mode || "public",
  ...settings.auto
};

global.plugins=new Map();
global.wolfCommands={};
function loadPlugins(){ /* your same loadPlugins */ }

const groupCache=new Map();

// FIXED SESSION HANDLER - DOESN'T BLOCK
async function handleSessionId() {
  const sessionPath = './session';
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });
  const sessionId = process.env.SESSION_ID || settings.SESSION_ID;
  
  if (!sessionId) {
    console.log(chalk.yellow("[WOLF TYPE 2] No SESSION_ID ENV - Running in PAIR MODE"));
    return false;
  }
  
  if (fs.existsSync(path.join(sessionPath, 'creds.json')) && fs.statSync(path.join(sessionPath, 'creds.json')).size > 100) {
    console.log(chalk.green("[WOLF TYPE 2] Session exists, using it."));
    return true;
  }

  console.log(chalk.cyan("[WOLF TYPE 2] Decoding SESSION_ID..."));
  try {
    let cleanId = sessionId.trim();
    if (cleanId.startsWith('WOLF~') || cleanId.includes('~')) cleanId = cleanId.split('~')[1] || cleanId;
    
    // Base64 decode
    let decoded = Buffer.from(cleanId, 'base64').toString('utf-8');
    if (!decoded.startsWith('{')) decoded = Buffer.from(decoded, 'base64').toString('utf-8');
    const data = JSON.parse(decoded);
    fs.writeFileSync(path.join(sessionPath, 'creds.json'), JSON.stringify(data, null, 2));
    console.log(chalk.green("[WOLF TYPE 2] SESSION_ID decoded!"));
    return true;
  } catch(e){
    console.log(chalk.red("[WOLF] Decode fail: "+e.message));
    return false;
  }
}

async function startConnection(){
  // START WEB SERVER FIRST - ALWAYS
  if(!global.appStarted){
    const app=express(); 
    app.use(express.json()); 
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname));
    
    // Serve your HTML
    app.get('/',(req,res)=>{
      const idx1 = path.join(__dirname,'index.html');
      if(fs.existsSync(idx1)) return res.sendFile(idx1);
      res.send('<h1>🐺 WOLF XMD TYPE 2</h1><p>Add index.html for dashboard</p>');
    });

    app.get('/health',(req,res)=>res.send('OK'));
    app.get('/api/status',(req,res)=>res.json({ status: global.connectionStatus, connected: global.isConnected, session: !!process.env.SESSION_ID }));

    // 🔥 REAL PAIR ENDPOINT - THIS FIXES YOUR HTML
    let tempSock = null;
    let tempSessionId = null;
    
    app.get('/getcode', async (req,res)=>{
      const number = req.query.number?.replace(/[^0-9]/g,'');
      if(!number) return res.json({error:'Enter number'});

      try {
        // If already connected as main bot, don't pair
        if(global.isConnected) {
          return res.json({error:'Bot already connected! Use SESSION_ID mode'});
        }

        if(fs.existsSync('./session')) fs.rmSync('./session',{recursive:true, force:true});
        const { state, saveCreds } = await useMultiFileAuthState('./session');
        const sock = makeWASocket({
          logger:pino({level:'silent'}),
          printQRInTerminal:false,
          browser: Browsers.macOS('Safari'),
          auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level:'silent'})) }
        });
        tempSock = sock;
        sock.ev.on('creds.update', saveCreds);
        
        const code = await sock.requestPairingCode(number);
        console.log(chalk.green(`[PAIR] Code for ${number}: ${code}`));

        // Listen for successful pair to generate WOLF~
        sock.ev.on('connection.update', async (u)=>{
          if(u.connection==='open'){
            await new Promise(r=>setTimeout(r,3000));
            if(fs.existsSync('./session/creds.json')){
              const creds = fs.readFileSync('./session/creds.json');
              tempSessionId = 'WOLF~' + Buffer.from(creds).toString('base64');
              console.log(chalk.green.bold(`\n✅ SESSION_ID GENERATED:\n${tempSessionId}\n`));
              try{
                const jid = number+'@s.whatsapp.net';
                await sock.sendMessage(jid,{text:`🐺 *WOLF XMD TYPE 2 SESSION*\n\n✅ Paired!\n\n*SESSION_ID:*\n\`\`\`${tempSessionId}\`\`\`\n\n1. Copy\n2. Render Dashboard > Environment > SESSION_ID\n3. Paste & Save\n4. Redeploy\n\nBot will be online!`});
                await sock.sendMessage(jid,{text: tempSessionId});
              }catch(e){ console.log('DM fail',e.message) }
              global.connectionStatus = 'PAIRED! Check WhatsApp DM for SESSION_ID';
            }
          }
        });

        res.json({code: code, message: 'Enter code in WhatsApp > Linked Devices'});

      } catch(err){
        res.json({error: err.message});
      }
    });

    const PORT=settings.port||process.env.PORT||10000; 
    app.listen(PORT,'0.0.0.0',()=>console.log(chalk.cyan(`🌐 Dashboard http://0.0.0.0:${PORT}`))); 
    global.appStarted=true;
  }

  // Try to decode SESSION_ID, but DON'T BLOCK if missing
  const hasSession = await handleSessionId();
  
  if (!hasSession) {
    console.log(chalk.yellow.bold("\n⚠️ PAIR MODE ACTIVE - Open your Render URL to pair!"));
    console.log(chalk.yellow("No SESSION_ID yet - Dashboard will generate it\n"));
    global.connectionStatus = 'PAIR MODE - Open URL to get WOLF~';
    return; // Don't start Baileys yet, just keep server running for pairing
  }

  // If session exists, connect as main bot
  console.log(chalk.green("Starting Baileys as MAIN BOT..."));
  // ... rest of your initBaileys code (keep your existing one)
  async function initBaileys(){
    const authPath=`./session`;
    const {state,saveCreds}=await useMultiFileAuthState(authPath); 
    const {version}=await fetchLatestBaileysVersion();
    const sock=makeWASocket({ 
      version, logger:pino({level:'silent'}), printQRInTerminal:false, 
      browser:Browsers.macOS('Safari'), 
      auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,pino({level:'silent'}))}, 
    });
    global.sock=sock; 
    sock.ev.on('creds.update',saveCreds);
    sock.ev.on('connection.update',async(update)=>{
      const {connection,lastDisconnect}=update;
      if(connection==='open'){
        global.isConnected=true; 
        global.connectionStatus='ONLINE ✅';
        console.log(chalk.green.bold(`\n✅ WOLF TYPE 2 ONLINE!\n`)); 
        try{ const h=require('./main.js'); await h(sock); }catch(e){ console.log(e.message) }
      }
      if(connection==='close'){
        const code=lastDisconnect?.error?.output?.statusCode; 
        console.log(chalk.red(`Closed ${code}`)); 
        if([401,440].includes(code)){ try{ fs.rmSync(`./session`,{recursive:true,force:true}); }catch{} }
        else setTimeout(()=>initBaileys(),5000); 
      }
    });
  }
  await initBaileys();
}

module.exports={startConnection};
if(require.main===module){ startConnection() }
