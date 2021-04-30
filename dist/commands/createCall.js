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
var commands_createCall_1 = __importDefault(require("../embeds/commands.createCall"));
module.exports = {
    name: 'createcall',
    description: '',
    args: true,
    usage: '<public/private> [Nome do canal]',
    roles: ['779054882916925480'],
    execute: execute
};
function execute(message, args) {
    var _a, _b;
    var type = args[0], channelName = args.slice(1);
    var userInDatabase = database_1.default.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();
    if (channelName.join(' ').length > 20)
        return message.channel.send(commands_createCall_1.default.nameVeryLarge);
    if (!!userInDatabase)
        return message.channel.send(commands_createCall_1.default.alreadyCreated);
    var everyone = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.roles.everyone.id;
    if (type === 'public' || type === 'private') {
        (_b = createChannelVoice(type)) === null || _b === void 0 ? void 0 : _b.then(function (channel) {
            if (!channel)
                return;
            message.channel.send(commands_createCall_1.default.channelCreated(type === 'private', channel === null || channel === void 0 ? void 0 : channel.id));
            waitForUsersToJoin(channel, message.author.id);
        });
    }
    else {
        message.channel.send(commands_createCall_1.default.typeNotExist);
    }
    function createChannelVoice(type) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!everyone)
                            return [2 /*return*/];
                        return [4 /*yield*/, ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.create("\u2756 " + channelName.join(' '), {
                                parent: '772812962854338564',
                                type: 'voice',
                                permissionOverwrites: type === 'public' ? [
                                    {
                                        id: everyone,
                                        allow: ['VIEW_CHANNEL', 'CONNECT']
                                    },
                                    {
                                        id: message.author.id,
                                        allow: ['PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
                                    }
                                ] : [
                                    {
                                        id: everyone,
                                        deny: ['VIEW_CHANNEL'],
                                        allow: ['CONNECT']
                                    },
                                    {
                                        id: message.author.id,
                                        allow: ['VIEW_CHANNEL', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
                                    }
                                ]
                            }))];
                    case 1:
                        channel = _b.sent();
                        !!channel && database_1.default.get('boostersThatCreatedCalls').push({ userId: message.author.id, channelId: channel.id }).write();
                        return [2 /*return*/, channel];
                }
            });
        });
    }
    function waitForUsersToJoin(channel, userId) {
        var _this = this;
        if (channel === undefined)
            return;
        return new Promise(function (terminated) { return setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var usersInCall;
            return __generator(this, function (_a) {
                usersInCall = [];
                channel.members.forEach(function (member) {
                    usersInCall.push(member);
                });
                if (usersInCall.length < 1) {
                    !channel.deleted && channel.delete();
                    database_1.default.get('boostersThatCreatedCalls').remove({ userId: userId }).write();
                    terminated(null);
                }
                return [2 /*return*/];
            });
        }); }, 1000 * 15); });
    }
}
