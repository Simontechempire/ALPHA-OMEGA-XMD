// 🐺 PT.JS - STARTER
console.log('🐺 WOLF XMD - pt.js -> connection.js');
try {
  const conn = require('./connection.js');
  const start = conn.startConnection || conn.AlphaOmegaConnection;
  if(typeof start !== 'function') throw new Error('startConnection not found in connection.js - re-push connection.js');
  start().catch(e=>{ console.log('Start fail:', e.message); setTimeout(()=>start(), 5000) });
} catch(e){
  console.log('pt.js load error:', e.message);
  console.log('Stack:', e.stack);
}
