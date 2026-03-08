require('dotenv').config();
const mongoose = require('mongoose');

// Source - https://stackoverflow.com/q/79875229
// Posted by Sudarsan Sarkar, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-08, License - CC BY-SA 4.0
const dns = require("dns").promises;
dns.setServers(["1.1.1.1", "1.0.0.1"]);


mongoose.connect("mongodb+srv://chatapp:chatapp123@cluster0.6rlnbno.mongodb.net/mla_dashboard", { family: 4 })
  .then(() => { console.log('✅ MongoDB Connected!'); process.exit(0); })
  .catch(err => { console.error('❌ Connection Failed:', err.message); process.exit(1); });