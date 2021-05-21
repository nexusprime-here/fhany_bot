"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("../database"));
var db = database_1.default; // error in types of lowdb
module.exports = {
    name: 'Temporary Calls',
    description: 'Cria um canal de voz que quando ninguém está usando, ela é excluida.',
    execute: execute
};
function execute(client, config) {
    return __awaiter(this, void 0, void 0, function () {
        var guild, controllerMessage;
        var _this = this;
        return __generator(this, function (_a) {
            guild = client.guilds.cache.get(config.guild);
            removeOldReactions(guild, config);
            removeEmptyCalls(guild);
            controllerMessage = function (type) {
                var _a;
                var channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(config.temporaryCalls[type].controllerChannel);
                return (channel === null || channel === void 0 ? void 0 : channel.isText()) && ((_a = channel.messages.cache.first()) === null || _a === void 0 ? void 0 : _a.id);
            };
            client.on('messageReactionAdd', function (data, user) { return __awaiter(_this, void 0, void 0, function () {
                var categoriesAccepted, userInDatabase, category;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!data.partial) return [3 /*break*/, 2];
                            return [4 /*yield*/, data.fetch()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (data.message.id !== controllerMessage('games') && data.message.id !== controllerMessage('normal'))
                                return [2 /*return*/];
                            removeReaction(data.message.channel.id, client, user, data);
                            categoriesAccepted = {
                                '🔮': 'LoL', '🛸': 'Among Us', '🔪': 'Brawlhala', '🏹': 'Genshin', '👹': 'Erebus/RPG',
                                '🔫': 'CoD', '🧊': 'Minecraft', '💣': 'Valorant', '🚓': 'GTA', '🚗': 'Rocket League',
                                '⚽': 'Esportes', '♟': 'Xadrez/Damas', '❓': 'Outros', '🎇': 'Bordel Vip', '🔹': 'Call Boosters',
                                '🔒': 'Privado', '🎧': 'Call Comum'
                            };
                            userInDatabase = db.get('usersThatCreatedCalls').find({ userId: user.id }).value();
                            category = Object.entries(categoriesAccepted).find(function (category) { return category[0] === data.emoji.name; });
                            !userInDatabase && !!category && function (_a) {
                                var _this = this;
                                var emoji = _a[0], name = _a[1];
                                if (!guild)
                                    return;
                                !userAlreadyOnCall(guild, user.id) && createChannel("\u5F61" + emoji + "\u2507 " + name, user.id, user.id, guild)
                                    .then(function (channel) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                _a = name === 'Bordel Vip';
                                                if (!_a) return [3 /*break*/, 2];
                                                return [4 /*yield*/, setSettings(channel, config.temporaryCalls.games.category, "vip", client, config)];
                                            case 1:
                                                _a = (_d.sent());
                                                _d.label = 2;
                                            case 2:
                                                _a;
                                                _b = name === 'Call Boosters';
                                                if (!_b) return [3 /*break*/, 4];
                                                return [4 /*yield*/, setSettings(channel, config.temporaryCalls.games.category, "booster", client, config)];
                                            case 3:
                                                _b = (_d.sent());
                                                _d.label = 4;
                                            case 4:
                                                _b;
                                                _c = name !== 'Bordel Vip' && name !== 'Call Boosters';
                                                if (!_c) return [3 /*break*/, 6];
                                                return [4 /*yield*/, setSettings(channel, config.temporaryCalls.games.category, "basic", client, config)];
                                            case 5:
                                                _c = (_d.sent());
                                                _d.label = 6;
                                            case 6:
                                                _c;
                                                return [4 /*yield*/, waitForUsersToJoin(channel, user.id, guild)];
                                            case 7:
                                                _d.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })
                                    .catch(function (err) { return console.error(err); });
                            }(category);
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
;
/* Functions */
function removeOldReactions(guild, config) {
    return __awaiter(this, void 0, void 0, function () {
        var controllerMessageGames, reactions;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!guild)
                        return [2 /*return*/];
                    return [4 /*yield*/, function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var channel, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            channel = guild.channels.cache.get(config.temporaryCalls.games.controllerChannel);
                                            if (!(channel === null || channel === void 0 ? void 0 : channel.isText())) return [3 /*break*/, 2];
                                            return [4 /*yield*/, channel.messages.fetch({ limit: 1 })];
                                        case 1:
                                            _a = (_b.sent()).first();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            _a = undefined;
                                            _b.label = 3;
                                        case 3: return [2 /*return*/, _a];
                                    }
                                });
                            });
                        }()];
                case 1:
                    controllerMessageGames = _a.sent();
                    reactions = controllerMessageGames === null || controllerMessageGames === void 0 ? void 0 : controllerMessageGames.reactions;
                    reactions === null || reactions === void 0 ? void 0 : reactions.cache.forEach(function (reaction) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, reaction.users.fetch()];
                                case 1: return [2 /*return*/, (_a.sent()).forEach(function (user) {
                                        var _a, _b;
                                        if (user.id === ((_a = guild.me) === null || _a === void 0 ? void 0 : _a.id))
                                            return;
                                        (_b = controllerMessageGames === null || controllerMessageGames === void 0 ? void 0 : controllerMessageGames.reactions.cache.find(function (r) { return r.emoji.name === reaction.emoji.name; })) === null || _b === void 0 ? void 0 : _b.users.remove(user.id);
                                    })];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
}
function removeEmptyCalls(guild) {
    if (!guild)
        return;
    var usersDB = db.get('usersThatCreatedCalls').value();
    var usersDB2 = db.get('boostersThatCreatedCalls').value();
    usersDB.forEach(function (user) {
        var _a, _b, _c, _d, _e;
        if (!user)
            return;
        var findChannel = function (id) { return guild.channels.cache.find(function (channel) { return channel.id === id; }); };
        var dbChannel = db.get('usersThatCreatedCalls').find({ channelId: (_a = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _a === void 0 ? void 0 : _a.id }).value();
        !!dbChannel && ((_b = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _b === void 0 ? void 0 : _b.members.size) === 0
            && db.get('usersThatCreatedCalls').remove({ channelId: (_c = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _c === void 0 ? void 0 : _c.id }).write();
        ((_d = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _d === void 0 ? void 0 : _d.members.size) === 0 && ((_e = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _e === void 0 ? void 0 : _e.delete());
    });
    usersDB2.forEach(function (user) {
        var _a, _b, _c, _d, _e;
        if (!user)
            return;
        var findChannel = function (id) { return guild.channels.cache.find(function (channel) { return channel.id === id; }); };
        var dbChannel = db.get('boostersThatCreatedCalls').find({ channelId: (_a = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _a === void 0 ? void 0 : _a.id }).value();
        !!dbChannel && ((_b = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _b === void 0 ? void 0 : _b.members.size) === 0
            && db.get('boostersThatCreatedCalls').remove({ channelId: (_c = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _c === void 0 ? void 0 : _c.id }).write();
        ((_d = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _d === void 0 ? void 0 : _d.members.size) === 0 && ((_e = findChannel(user === null || user === void 0 ? void 0 : user.channelId)) === null || _e === void 0 ? void 0 : _e.delete());
    });
}
function userAlreadyOnCall(guild, memberId) {
    var member = guild.members.cache.get(memberId);
    if (!member)
        return;
    return !!member.voice.channel;
}
;
function removeReaction(channelId, client, user, data) {
    return __awaiter(this, void 0, void 0, function () {
        var channel;
        return __generator(this, function (_a) {
            channel = client.channels.cache.get(channelId);
            if (!(channel === null || channel === void 0 ? void 0 : channel.isText()))
                return [2 /*return*/];
            channel === null || channel === void 0 ? void 0 : channel.messages.fetch().then(function (channelMessages) {
                var message = channelMessages.first();
                var reaction = message === null || message === void 0 ? void 0 : message.reactions.cache.find(function (reaction) { return !!reaction.count && reaction.count > 1; });
                reaction === null || reaction === void 0 ? void 0 : reaction.users.remove(user.id);
            });
            return [2 /*return*/];
        });
    });
}
;
function createChannel(channelName, userId, channelId, guild) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            !!guild && guild.channels.create(channelName, { type: 'voice' })
                .then(function (channel) {
                db.get('usersThatCreatedCalls').push({ userId: userId, channelId: channel.id }).write();
                resolve(channel);
            })
                .catch(function (err) { return reject(err); });
            return [2 /*return*/];
        });
    }); });
}
;
function setSettings(channel, category, type, client, config) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var everyone, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    channel.setParent(category);
                    everyone = (_a = client.guilds.cache.get(config.guildId)) === null || _a === void 0 ? void 0 : _a.roles.everyone.id;
                    if (!everyone)
                        return [2 /*return*/];
                    _b = type === 'basic';
                    if (!_b) return [3 /*break*/, 2];
                    return [4 /*yield*/, channel.overwritePermissions([
                            {
                                id: everyone,
                                allow: ['CONNECT', 'VIEW_CHANNEL']
                            },
                        ])];
                case 1:
                    _b = (_e.sent());
                    _e.label = 2;
                case 2:
                    _b;
                    _c = type === 'booster';
                    if (!_c) return [3 /*break*/, 4];
                    return [4 /*yield*/, channel.overwritePermissions([
                            {
                                id: everyone,
                                deny: ['CONNECT']
                            },
                            {
                                id: config.temporaryCalls.roles.booster,
                                allow: ['CONNECT']
                            }
                        ])];
                case 3:
                    _c = (_e.sent());
                    _e.label = 4;
                case 4:
                    _c;
                    _d = type === 'vip';
                    if (!_d) return [3 /*break*/, 6];
                    return [4 /*yield*/, channel.overwritePermissions([
                            {
                                id: everyone,
                                deny: ['CONNECT']
                            },
                            {
                                id: config.temporaryCalls.roles.vip,
                                allow: ['CONNECT']
                            }
                        ])];
                case 5:
                    _d = (_e.sent());
                    _e.label = 6;
                case 6:
                    _d;
                    return [2 /*return*/];
            }
        });
    });
}
;
function waitForUsersToJoin(channel, userId, guild, lol) {
    if (lol === void 0) { lol = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (channel === undefined)
                return [2 /*return*/];
            return [2 /*return*/, new Promise(function (terminated) { return setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var usersInCall;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                usersInCall = [];
                                return [4 /*yield*/, guild.channels.cache.get(channel.id).members.forEach(function (member) {
                                        usersInCall.push(member);
                                    })];
                            case 1:
                                _a.sent();
                                lol === true && easterEgg(usersInCall, channel);
                                if (usersInCall.length < 1) {
                                    !channel.deleted && channel.delete();
                                    db.get('usersThatCreatedCalls').remove({ userId: userId }).write();
                                    terminated();
                                }
                                else
                                    terminated(channel);
                                return [2 /*return*/];
                        }
                    });
                }); }, 1000 * 15); })];
        });
    });
}
function easterEgg(users, channel) {
    return __awaiter(this, void 0, void 0, function () {
        var findLoLSuperUser, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    findLoLSuperUser = new Promise(function (resolve, reject) {
                        users.forEach(function (user) { return user.roles.cache.has('748437789250682911') && resolve(); });
                        reject();
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 6]);
                    return [4 /*yield*/, findLoLSuperUser];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, channel.setName('★🔮┇ LoL 𝓈𝓊𝓅𝑒𝓇')];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    _a = _b.sent();
                    return [4 /*yield*/, channel.setName('彡🔮┇ LoL')];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [2 /*return*/];
            }
        });
    });
}
