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
var commands_accept_1 = __importDefault(require("../embeds/commands.accept"));
var db = database_1.default;
module.exports = {
    name: 'aceitar',
    description: 'Aceita uma sugestão do canal sugestões',
    execute: function (message, args, client, config) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            /* Functions */
            function sendDataForDB() {
                var _a;
                db.get('suggestionsCache').find({ id: (_a = referenceMessage.embeds[0].footer) === null || _a === void 0 ? void 0 : _a.text }).assign({ accept: true }).write();
            }
            function isStaff() {
                return new Promise((function (terminated) {
                    var guild = client.guilds.cache.get(config.guild);
                    var member = guild === null || guild === void 0 ? void 0 : guild.members.cache.find(function (member) { return member.id === message.author.id; });
                    member === null || member === void 0 ? void 0 : member.roles.cache.forEach(function (role) {
                        config.suggestion.permittedRoles.forEach(function (role2) {
                            role.id === role2 && terminated(true);
                        });
                    });
                    terminated(false);
                }));
            }
            function deleteCommandMessage() {
                message.delete();
            }
            function sendSucessMessageAndRemoveMessage() {
                return __awaiter(this, void 0, void 0, function () {
                    var thisMessage;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.channel.send(commands_accept_1.default.sucess)];
                            case 1:
                                thisMessage = _a.sent();
                                setTimeout(function () { return thisMessage.delete(); }, 5000);
                                return [2 /*return*/];
                        }
                    });
                });
            }
            function sendErrorMessageAndRemoveCommandMessage() {
                message.reply(commands_accept_1.default.notExistMessageReference)
                    .then(function (msg) { return setTimeout(function () { return msg.delete(); }, 1000 * 5); });
                message.delete();
            }
            function editSuggestionMessage() {
                var _a = referenceMessage.embeds[0], author = _a.author, description = _a.description, fields = _a.fields, footer = _a.footer;
                if (!author || !description || !footer)
                    return;
                referenceMessage.edit(commands_accept_1.default.editSuggestionMessage(author, description, fields, footer));
            }
            function alertSuggestionAuthor() {
                var _a, _b;
                var userId = db.get('suggestionsCache').find({ id: (_a = referenceMessage.embeds[0].footer) === null || _a === void 0 ? void 0 : _a.text }).value().author.id;
                (_b = message.client.users.cache.get(userId)) === null || _b === void 0 ? void 0 : _b.send(commands_accept_1.default.suggestionAccept);
            }
            var referenceMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, isStaff()];
                    case 1:
                        if (!(_b.sent()))
                            return [2 /*return*/, deleteCommandMessage()];
                        if (!message.reference)
                            return [2 /*return*/, sendErrorMessageAndRemoveCommandMessage()];
                        if (!message.reference.messageID)
                            return [2 /*return*/, sendErrorMessageAndRemoveCommandMessage()];
                        return [4 /*yield*/, message.channel.messages.fetch((_a = message.reference) === null || _a === void 0 ? void 0 : _a.messageID)];
                    case 2:
                        referenceMessage = _b.sent();
                        editSuggestionMessage();
                        sendDataForDB();
                        alertSuggestionAuthor();
                        deleteCommandMessage();
                        sendSucessMessageAndRemoveMessage();
                        ;
                        return [2 /*return*/];
                }
            });
        });
    }
};
