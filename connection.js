// 🐺 ALPHA AND OMEGA WOLF XMD - CONNECTION FINAL - WORKING LINK METHOD
// Fixed paths for your structure
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  Browsers
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const fs = require('fs');

let config;
try {
  config = require('./settings');
} catch {
  config = {
    botName: "ALPHA AND OMEGA WOLF XMD",
    ownerName: "Simon Tech Inc",
    ownerNumber: "239166265317",
    prefix: ".",
    sessionName: "session",
    PORT: process.env.PORT || 10000
  };
}

global.sock = null;
global.isConnected = false;
global.connectionStatus = 'Starting WOLF Bot...';
global.pairingCode = null;
global.currentPairingNumber = null;
global.lastPairTime = 0;
global.appStarted = false;

async function AlphaOmegaConnection() {
  // --- EXPRESS SERVER + PAIR API - ONLY ONCE ---
  if (!global.appStarted) {
    const app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Serve your index.html
    app.use(express.static(__dirname));
    app.get('/', (req, res) => {
      const p1 = path.join(__dirname, 'index.html');
      const p2 = path.join(__dirname, 'public/index.html');
      if (fs.existsSync(p1)) res.sendFile(p1);
      else if (fs.existsSync(p2)) res.sendFile(p2);
      else res.send('🐺 WOLF ONLINE - Add index.html');
    });

    app.get('/api/status', (req, res) => {
      res.json({
        botName: config.botName || "WOLF XMD",
        owner: config.ownerName || "Simon Tech",
        ownerNumber: config.ownerNumber,
        prefix: config.prefix,
        status: global.connectionStatus,
        isConnected: global.isConnected,
        pairingCode: global.pairingCode,
        pairingNumber: global.currentPairingNumber,
        uptime: process.uptime()
      });
    });

    // YOUR WORKING PAIR METHOD - REAL LINKING
    app.post('/api/pair', async (req, res) => {
      try {
        let phone = (req.body.phone || req.query.number || '').toString().replace(/[^0-9]/g, '');
        if (!phone || phone.length < 10) {
          return res.json({ success: false, message: 'Enter valid number e.g 239166265317' });
        }
        if (!global.sock) {
          return res.json({ success: false, message: 'Bot still starting... wait 5 sec and retry' });
        }
        if (global.isConnected) {
          return res.json({ success: false, message: 'Bot already linked!' });
        }

        const now = Date.now();
        if (global.pairingCode && (now - global.lastPairTime) < 50000) {
          return res.json({ 
            success: true, 
            code: global.pairingCode, 
            phone: global.currentPairingNumber,
            message: `Use this code - expires in ${Math.ceil((50000 - (now - global.lastPairTime))/1000)}s` 
          });
        }
        if ((now - global.lastPairTime) < 10000) {
          return res.json({ success: false, message: `Wait ${Math.ceil((10000 - (now - global.lastPairTime))/1000)}s before new code` });
        }

        global.lastPairTime = now;
        console.log(chalk.yellow(`\n🐺 Generating REAL code for ${phone}`));

        const code = await global.sock.requestPairingCode(phone);

        global.pairingCode = code;
        global.currentPairingNumber = phone;
        global.connectionStatus = `CODE: ${code} - Enter NOW in WhatsApp!`;

        console.log(chalk.green.bold(`\n╔════════════════════════════╗`));
        console.log(chalk.green.bold(`║  CODE: ${code.padEnd(20)}║`));
        console.log(chalk.green.bold(`║  NUMBER: ${phone.padEnd(16)}║`));
        console.log(chalk.green.bold(`╚════════════════════════════╝\n`));

        res.json({ success: true, code, phone, message: 'Valid 60s - Enter NOW!' });

      } catch (err) {
        console.error(chalk.red('Pair error:'), err.message);
        let msg = err.message;
        if (msg.includes('rate')) msg = 'Too many tries - Wait 5 mins';
        if (msg.includes('not-authorized')) msg = 'Number not on WhatsApp';
        res.json({ success: false, message: msg });
      }
    });

    // Legacy GET support for your old HTML
    app.get('/getcode', async (req,res)=>{
      req.body = { phone: req.query.number };
      return app._router.handle({ ...req, method:'POST', url:'/api/pair', body: { phone: req.query.number } }, res, ()=>{});
    });

    app.post('/api/logout', async (req, res) => {
      try { if (global.sock) await global.sock.logout(); } catch {}
      try { fs.rmSync(`./${config.sessionName || 'session'}`, { recursive: true, force: true }); } catch {}
      global.isConnected = false;
      global.pairingCode = null;
      global.connectionStatus = 'Logged out - Ready to pair';
      res.json({ success: true });
    });

    const PORT = config.PORT || process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(chalk.cyan.bold(`\n🌐 WOLF Dashboard → http://localhost:${PORT}\n`));
    });
    global.appStarted = true;
  }

  // --- BAILEYS CORE ---
  async function initBaileys() {
    const { state, saveCreds } = await useMultiFileAuthState(`./${config.sessionName || 'session'}`);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS('Safari'),
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
      },
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true,
      syncFullHistory: false,
      defaultQueryTimeoutMs: undefined,
      connectTimeoutMs: 60000,
    });

    global.sock = sock;
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'connecting') {
        global.connectionStatus = global.pairingCode ? `Waiting for code ${global.pairingCode}...` : 'Connecting...';
        console.log(chalk.yellow(`⏳ ${global.connectionStatus}`));
      }

      if (connection === 'open') {
        global.isConnected = true;
        global.connectionStatus = 'WOLF XMD ONLINE ✅';
        global.pairingCode = null;
        console.log(chalk.green.bold(`\n✅ WOLF LINKED SUCCESSFULLY!\n`));
        
        // Load your main.js with 710 cmds
        try {
          require('./main.js')(sock);
          console.log(chalk.green(`✅ main.js loaded - 710 cmds`));
        } catch (e) {
          console.log(chalk.red('main.js error:'), e.message);
        }
      }

      if (connection === 'close') {
        global.isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        console.log(chalk.red(`❌ Closed: ${statusCode}`));

        if (shouldReconnect) {
          global.connectionStatus = 'Reconnecting in 3s...';
          setTimeout(() => initBaileys(), 3000);
        } else {
          global.connectionStatus = 'Logged out - Delete session folder';
          try { fs.rmSync(`./${config.sessionName || 'session'}`, { recursive: true, force: true }); } catch {}
          setTimeout(() => initBaileys(), 3000);
        }
      }
    });
  }

  await initBaileys();
}

module.exports = { AlphaOmegaConnection };
