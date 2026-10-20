// 🐺 INDEX.JS - STARTER
console.log('🐺 WOLF XMD - index.js -> connection.js');
try {
  const conn = require('./connection.js');
  const start = conn.startConnection || conn.AlphaOmegaConnection;
  start().catch(e=>{ console.log('Start fail:', e.message); setTimeout(()=>start(), 5000) });
} catch(e){
  console.log('index.js load error:', e.message);
}
