// 🐺 PT.JS -> CALLS CONNECTION.JS LINKER
const { startConnection } = require('./connection.js');
startConnection().catch(e=>{ console.log(e.message); setTimeout(()=>startConnection(), 5000) });
