const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ usersThatCreatedCalls: [], boostersThatCreatedCalls: [], suggestionsCache: [], reminders: [] }).write();

export default db;