// 🐺 ALPHA AND OMEGA WOLF XMD - index.js - TYPE 2
// This is backup entry - Render uses Pt.js as main
// Compatible with Prince Host Dashboard

require('dotenv').config();

console.log(`
🐺 ALPHA AND OMEGA - index.js - TYPE 2
Loading connection...
Session: ${process.env.SESSION_ID ? 'OK ✓' : 'MISSING - Set in Dashboard!'}
`);

// Forward to connection.js - Type 2 core
module.exports = require('./connection.js');

// Auto-start if run directly with node index.js
if (require.main === module) {
  console.log("[WOLF TYPE 2] index.js triggered, starting bot...");
  require('./connection.js').startConnection();
}
