const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('cache.json');
const db = low(adapter);

export const defaultCategories = { 
    usersThatCreatedCalls: [], 
    boostersThatCreatedCalls: [], 
    suggestionsCache: [], 
    hashtags: {}
}

db.defaults(defaultCategories).write();

export default db;
