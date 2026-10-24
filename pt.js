// 🐺 ALPHA AND OMEGA WOLF XMD - Pt.js - TYPE 2 ENTRY POINT
// Compatible with Render / Prince Host Dashboard

console.log(`
🐺 ALPHA AND OMEGA WOLF XMD - TYPE 2
═══════════════════════════════════════
Bot: ${process.env.BOT_NAME || 'ALPHA AND OMEGA'}
Mode: ${process.env.MODE || 'public'}
Prefix: ${process.env.PREFIX || '.'}
Session: ${process.env.SESSION_ID ? 'FOUND ✓' : 'MISSING ✗'}
Port: ${process.env.PORT || 3000}
═══════════════════════════════════════
`);

const connection = require('./connection.js');

// Type 2 Check
if (!process.env.SESSION_ID) {
  console.error(`
❌ [WOLF TYPE 2 ERROR] SESSION_ID is REQUIRED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Go to your Pair Site: https://your-pair-site.onrender.com
2. Enter number and pair
3. Copy SESSION_ID (WOLF~.....)
4. Go to Prince Host Dashboard -> ENV Variables
5. Paste in SESSION_ID field
6. Redeploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  // Don't crash Render, just wait so user sees log
  setTimeout(() => {
    console.log("[WOLF] Retrying in 10 seconds for ENV update...");
  }, 10000);
}

// Start the bot - If this file is run directly
if (require.main === module) {
  console.log("[WOLF TYPE 2] Starting connection from Pt.js...");
  connection.startConnection();
}

// Export for other uses
module.exports = connection;
