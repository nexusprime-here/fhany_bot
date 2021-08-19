const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('cache.json');
const db = low(adapter);

db.defaults({ 
    usersThatCreatedCalls: [], 
    boostersThatCreatedCalls: [], 
    suggestionsCache: [], 
    noticesNotAnswered: []
}).write();

export default db;
