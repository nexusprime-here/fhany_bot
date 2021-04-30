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
var features_fhanyPresenceDetector_1 = __importDefault(require("../embeds/features.fhanyPresenceDetector"));
module.exports = {
    name: "Fhany Presence Detector",
    description: "Detecta a Fhany no chat e avisa para os usuários, se a Fhany não estiver ativa no chat os usuários não podem mencionar.",
    execute: execute
};
function execute(client, config) {
    var _this = this;
    var fhanyActiveCache = []; // I used Array from detect if the Fhany is inactive more easy, if an array is empty, she is inactive
    var wrongMentionsCache = [];
    client.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
        function mentionTheFhany(message) {
            return new Promise(function (terminated) {
                var _a;
                var fhany = (_a = client.guilds.cache.get(config.guildId)) === null || _a === void 0 ? void 0 : _a.members.cache.get(config.fhanyPresenceDetector.fhanyId);
                if (!fhany)
                    return;
                fhany.roles.cache.forEach(function (role) {
                    message.mentions.users.has(config.fhanyPresenceDetector.fhanyId) && terminated(true);
                    message.mentions.roles.has(role.id) && terminated(true);
                });
                terminated(false);
            });
        }
        function deleteUserMessage(message) {
            searchUserInCache(message.author).length === 0
                && message.reply(features_fhanyPresenceDetector_1.default.mentionFhanyNotPermitted1(message));
            searchUserInCache(message.author).length === 1
                && message.reply(features_fhanyPresenceDetector_1.default.mentionFhanyNotPermitted2(message));
            searchUserInCache(message.author).length === 2
                && addSilenceRole(searchUserInCache(message.author)[0])
                && message.reply(features_fhanyPresenceDetector_1.default.mentionFhanyNotPermitted3(message))
                && removeSilenceRole(searchUserInCache(message.author)[0]);
            message.delete();
            var guild = client.guilds.cache.get(config.guildId);
            var user = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(message.author.id);
            !!user && wrongMentionsCache.push(user);
            setTimeout(deleteMentionCache, 1000 * 60 * 30);
            function addSilenceRole(member) {
                member.roles.add(config.fhanyPresenceDetector.roles.silence);
                return true;
            }
            function removeSilenceRole(member) {
                setTimeout(function () {
                    member.roles.remove(config.fhanyPresenceDetector.roles.silence);
                }, 1000 * 60 * 60 * 1);
            }
            function deleteMentionCache() {
                wrongMentionsCache.forEach(function (user, index) {
                    user.id === message.author.id && wrongMentionsCache.splice(index, 1);
                });
            }
            function searchUserInCache(user) {
                return wrongMentionsCache.filter(function (member) { return member.id === user.id; });
            }
        }
        var fetchChannel, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (message.author.bot)
                        return [2 /*return*/];
                    if (!config.fhanyPresenceDetector.channelsId.includes(message.channel.id))
                        return [2 /*return*/];
                    if (!(message.author.id === config.fhanyPresenceDetector.fhanyId)) return [3 /*break*/, 3];
                    fetchChannel = client.channels.cache.get(message.channel.id);
                    count = getLastNumber();
                    fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOn(fetchChannel);
                    cleanOldCache();
                    return [4 /*yield*/, pushNewCache(count)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cleanCacheIn(1000 * 60, count)];
                case 2:
                    _a.sent();
                    fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOff(fetchChannel);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, mentionTheFhany(message)];
                case 4:
                    if (!(_a.sent()))
                        return [2 /*return*/];
                    fhanyActiveCache.length === 0 && deleteUserMessage(message);
                    _a.label = 5;
                case 5:
                    ;
                    ;
                    return [2 /*return*/];
            }
        });
    }); });
    client.on('typingStart', function (channel, user) { return __awaiter(_this, void 0, void 0, function () {
        var fetchChannel, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config.fhanyPresenceDetector.channelsId.includes(channel.id))
                        return [2 /*return*/];
                    if (user.id !== config.fhanyPresenceDetector.fhanyId)
                        return [2 /*return*/];
                    fetchChannel = client.channels.cache.get(channel.id);
                    count = getLastNumber();
                    fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOn(fetchChannel);
                    cleanOldCache();
                    return [4 /*yield*/, pushNewCache(count)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, cleanCacheIn(1000 * 60, count)];
                case 2:
                    _a.sent();
                    fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOff(fetchChannel);
                    return [2 /*return*/];
            }
        });
    }); });
    /* Global Functions */
    function warnAllUsersOfFhanyOff(channel) {
        channel.send(features_fhanyPresenceDetector_1.default.fhanyLeftTheChat)
            .then(function (msg) { return setTimeout(function () { return msg.delete(); }, 1000 * 25); });
    }
    ;
    function warnAllUsersOfFhanyOn(channel) {
        channel.send(features_fhanyPresenceDetector_1.default.fhanyIsActiveInChat)
            .then(function (msg) { return setTimeout(function () { return msg.delete(); }, 1000 * 25); });
    }
    ;
    function getLastNumber() {
        if (fhanyActiveCache.length === 0) {
            return 1;
        }
        else {
            var count = fhanyActiveCache[0]++; // I don't know why, but yhe code only worked if there was this line
            return fhanyActiveCache[0]++;
        }
        ;
    }
    ;
    function cleanCacheIn(timeOut, id) {
        return new Promise(function (terminated) { return setTimeout(function () {
            var index = fhanyActiveCache.indexOf(id);
            if (index < 0)
                return terminated();
            fhanyActiveCache.splice(index, 1);
            terminated();
        }, timeOut); });
    }
    ;
    function pushNewCache(numberOfOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                fhanyActiveCache.push(numberOfOrder);
                return [2 /*return*/];
            });
        });
    }
    ;
    function cleanOldCache() {
        fhanyActiveCache.length = 0;
    }
    ;
}
