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
var discord_js_1 = require("discord.js");
var database_1 = __importDefault(require("../database"));
var features_suggestion_1 = __importDefault(require("../embeds/features.suggestion"));
var db = database_1.default;
module.exports = {
    name: "Suggetion",
    description: "Um sistema que separa as mensagens mais curtidas das menos curtidas",
    execute: execute
};
function execute(client, config) {
    var _this = this;
    var channel = client.channels.cache.get(config.suggestion.channelId);
    var suggestionsCache = db.get('suggestionsCache').value();
    (channel === null || channel === void 0 ? void 0 : channel.type) === 'text' && deleteAllOldMessages(channel);
    reloadSuggestions();
    var actionsCache = 0;
    client.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (message.channel.id !== config.suggestion.channelId)
                        return [2 /*return*/];
                    if (message.author.bot)
                        return [2 /*return*/];
                    if (message.content.startsWith(config.prefix) && message.author.id)
                        return [2 /*return*/];
                    actionsCache++;
                    saveSuggestionInSuggestionsCache(message);
                    return [4 /*yield*/, deleteCommandMessage(message)];
                case 1:
                    _a.sent();
                    alertUser('message', message);
                    return [2 /*return*/];
            }
        });
    }); });
    client.on('messageReactionAdd', function (data, user) { return __awaiter(_this, void 0, void 0, function () {
        var findMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (data.message.channel.id !== config.suggestion.channelId)
                        return [2 /*return*/];
                    if (user.bot)
                        return [2 /*return*/];
                    actionsCache++;
                    findMessage = suggestionsCache.find(function (message) { var _a; return message.id === ((_a = data.message.embeds[0].footer) === null || _a === void 0 ? void 0 : _a.text); });
                    return [4 /*yield*/, userAlreadyRated(user, findMessage === null || findMessage === void 0 ? void 0 : findMessage.id)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/, removeReaction(data.emoji.name, data.message.channel.id, data.message.id, user.id)];
                    }
                    if (!(findMessage === null || findMessage === void 0 ? void 0 : findMessage.id))
                        return [2 /*return*/];
                    if (data.emoji.name === '👍')
                        setRate('+', findMessage.id, user.id);
                    else if (data.emoji.name === '👎')
                        setRate('-', findMessage.id, user.id);
                    alertUser('reaction', data.message);
                    return [2 /*return*/];
            }
        });
    }); });
    setInterval(function () { return actionsCache > 0 && reloadSuggestions(); }, 1000 * 60 * 30);
    setDaysTimeout(function () { return db.get('suggestionsCache').remove({}).write(); }, 7);
    /* Functions */
    function setDaysTimeout(callback, days) {
        // 86400 seconds in a day
        var msInDay = 86400 * 1000;
        var dayCount = 0;
        var timer = setInterval(function () {
            dayCount++; // a day has passed
            if (dayCount === days) {
                clearInterval(timer);
                callback.apply(this, []);
            }
        }, msInDay);
    }
    function alertUser(type, message) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var thisMessage_1, alert_1, normal_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!(type === 'message')) return [3 /*break*/, 2];
                        return [4 /*yield*/, message.channel.send("<@" + message.author.id + ">", features_suggestion_1.default.messageSent(message.author.id))];
                    case 1:
                        thisMessage_1 = _g.sent();
                        setTimeout(function () { return thisMessage_1.delete(); }, 7000);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(type === 'reaction')) return [3 /*break*/, 4];
                        alert_1 = new discord_js_1.MessageEmbed()
                            .setAuthor((_a = message.embeds[0].author) === null || _a === void 0 ? void 0 : _a.name, ((_b = message.embeds[0].author) === null || _b === void 0 ? void 0 : _b.iconURL) || undefined)
                            .setDescription('**✅ Avaliação Enviada!**\n\n' + message.embeds[0].description)
                            .setFooter((_c = message.embeds[0].footer) === null || _c === void 0 ? void 0 : _c.text)
                            .setColor('#F55EB3')
                            .addFields(message.embeds[0].fields);
                        normal_1 = new discord_js_1.MessageEmbed()
                            .setAuthor((_d = message.embeds[0].author) === null || _d === void 0 ? void 0 : _d.name, ((_e = message.embeds[0].author) === null || _e === void 0 ? void 0 : _e.iconURL) || undefined)
                            .setDescription(message.embeds[0].description)
                            .setFooter((_f = message.embeds[0].footer) === null || _f === void 0 ? void 0 : _f.text)
                            .setColor('#F55EB3')
                            .addFields(message.embeds[0].fields);
                        return [4 /*yield*/, message.edit(alert_1)];
                    case 3:
                        _g.sent();
                        setTimeout(function () { return message.edit(normal_1); }, 5000);
                        _g.label = 4;
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    }
    ;
    function reloadSuggestions() {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var reorganizedSuggestions, channel, allMessages, embed;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (suggestionsCache.length < 1)
                            return [2 /*return*/];
                        reorganizedSuggestions = suggestionsCache.sort(function (a, b) {
                            var result = a.likes.length - a.dislikes.length;
                            var result2 = b.likes.length - b.dislikes.length;
                            if (result > result2)
                                return 1;
                            else if (result < result2)
                                return -1;
                            else
                                return 0;
                        });
                        channel = (_a = client.guilds.cache.get(config.guildId)) === null || _a === void 0 ? void 0 : _a.channels.cache.get(config.suggestion.channelId);
                        if (!(channel === null || channel === void 0 ? void 0 : channel.isText()))
                            return [2 /*return*/];
                        return [4 /*yield*/, channel.messages.fetch({ limit: 100 })];
                    case 1:
                        allMessages = _b.sent();
                        channel.bulkDelete(allMessages);
                        embed = function (suggestion) { return new discord_js_1.MessageEmbed()
                            .setAuthor(suggestion.author.username, suggestion.icon || undefined)
                            .setDescription(suggestion.content)
                            .setFooter(suggestion.id)
                            .setColor(suggestion.accept ? '#00FF00' : '#F55EB3')
                            .addFields([
                            {
                                name: 'ㅤ',
                                value: "\uD83D\uDC4D: " + suggestion.likes.length,
                                inline: true
                            },
                            {
                                name: 'ㅤ',
                                value: "\uD83D\uDC4E: " + suggestion.dislikes.length,
                                inline: true
                            }
                        ]); };
                        reorganizedSuggestions.forEach(function (suggestion) { return __awaiter(_this, void 0, void 0, function () {
                            var msg, _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, channel.send(embed(suggestion))];
                                    case 1:
                                        msg = _c.sent();
                                        _b = !!msg;
                                        if (!_b) return [3 /*break*/, 3];
                                        return [4 /*yield*/, msg.react('👍')];
                                    case 2:
                                        _b = (_c.sent());
                                        _c.label = 3;
                                    case 3:
                                        _a = _b;
                                        if (!_a) return [3 /*break*/, 5];
                                        return [4 /*yield*/, msg.react('👎')];
                                    case 4:
                                        _a = (_c.sent());
                                        _c.label = 5;
                                    case 5:
                                        _a;
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        actionsCache = 0; // clean cache
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteAllOldMessages(channel) {
        return __awaiter(this, void 0, void 0, function () {
            var fetched;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, channel.messages.fetch({ limit: 100 })];
                    case 1:
                        fetched = _a.sent();
                        channel.bulkDelete(fetched);
                        return [2 /*return*/];
                }
            });
        });
    }
    function removeReaction(emoji, channelId, messageId, userId) {
        var channel = client.channels.cache.get(channelId);
        channel.messages.fetch(messageId).then(function (reactionMessage) {
            reactionMessage.reactions.resolve(emoji).users.remove(userId);
        });
    }
    function setRate(rate, suggestionId, userId) {
        var suggestion = db.get('suggestionsCache').find({ id: suggestionId });
        rate === '+' && suggestion.get('likes').push(userId).write();
        rate === '-' && suggestion.get('dislikes').push(userId).write();
    }
    function userAlreadyRated(user, id) {
        if (!id)
            return;
        return new Promise(function (terminated) {
            suggestionsCache.forEach(function (suggestion) {
                if (suggestion.id !== id)
                    return;
                suggestion.likes.includes(user.id) && terminated(true);
                suggestion.dislikes.includes(user.id) && terminated(true);
            });
            terminated(false);
        });
    }
    function saveSuggestionInSuggestionsCache(suggestionMessage) {
        if (!suggestionMessage.member)
            return;
        db.get('suggestionsCache').push({
            icon: suggestionMessage.author.avatarURL(),
            content: suggestionMessage.content,
            id: suggestionMessage.id,
            author: {
                username: suggestionMessage.member.user.username,
                id: suggestionMessage.member.user.id
            },
            accept: false,
            likes: [],
            dislikes: []
        }).write();
    }
    function deleteCommandMessage(message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, message.delete()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
}
