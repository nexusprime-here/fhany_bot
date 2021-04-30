"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);
db.defaults({ usersThatCreatedCalls: [], boostersThatCreatedCalls: [], suggestionsCache: [], reminders: [] }).write();
exports.default = db;
