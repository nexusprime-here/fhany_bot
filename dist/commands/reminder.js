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
var commands_reminder_1 = __importDefault(require("../embeds/commands.reminder"));
module.exports = {
    name: 'reminder',
    description: 'Aceita uma sugestão do canal sugestões',
    execute: function (message, args, client) {
        return __awaiter(this, void 0, void 0, function () {
            function getTitle(message) {
                return __awaiter(this, void 0, void 0, function () {
                    var title;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setTitle)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                title = (_a.sent()).first();
                                title === null || title === void 0 ? void 0 : title.delete();
                                if (!(title && title.content.length > 50)) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Título muito grande!' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, title ? title.content : ''];
                        }
                    });
                });
            }
            function getDescription(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var description;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setDescription(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                description = (_a.sent()).first();
                                description === null || description === void 0 ? void 0 : description.delete();
                                if (!(description && description.content.length > 1700)) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Descrição muito grande!' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, description ? description.content : ''];
                        }
                    });
                });
            }
            function getRepeat(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var repeat;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.repeatEveryDay(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                repeat = (_a.sent()).first();
                                repeat === null || repeat === void 0 ? void 0 : repeat.delete();
                                if (!(repeat && repeat.content.toLowerCase() !== 'y' && repeat.content.toLowerCase() !== 'n')) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Resposta Inválida.' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, (repeat === null || repeat === void 0 ? void 0 : repeat.content.toLowerCase()) === 'y' ? true : false];
                        }
                    });
                });
            }
            function getDate(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var date;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setDate(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                date = (_a.sent()).first();
                                date === null || date === void 0 ? void 0 : date.delete();
                                if (!(date && (parseInt(date.content) > 31 || parseInt(date.content) < 1))) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Dia Inválido.' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, date ? parseInt(date.content) : 0];
                        }
                    });
                });
            }
            function getMonth(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var month;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setMonth(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                month = (_a.sent()).first();
                                month === null || month === void 0 ? void 0 : month.delete();
                                if (!(month && (parseInt(month.content) > 31 || parseInt(month.content) < 1))) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Mês Inválido.' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, month ? parseInt(month.content) : 0];
                        }
                    });
                });
            }
            function getYear(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var year;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setYear(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                year = (_a.sent()).first();
                                year === null || year === void 0 ? void 0 : year.delete();
                                if (!(year && parseInt(year.content) < new Date().getFullYear())) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Ano Inválido.' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, year ? parseInt(year.content) : 0];
                        }
                    });
                });
            }
            function getHours(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var hours;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setHours(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                hours = (_a.sent()).first();
                                hours === null || hours === void 0 ? void 0 : hours.delete();
                                if (!(hours && (parseInt(hours.content) > 23 || parseInt(hours.content) < 0))) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Hora Inválida.' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, hours ? parseInt(hours.content) : 0];
                        }
                    });
                });
            }
            function getMinutes(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var minutes;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.setMinutes(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                minutes = (_a.sent()).first();
                                minutes === null || minutes === void 0 ? void 0 : minutes.delete();
                                if (!(minutes && (parseInt(minutes.content) > 59 || parseInt(minutes.content) < 0))) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.edit({ embed: { color: '#e31c17', title: '❌ Minutos Inválido.' } })];
                            case 3:
                                _a.sent();
                                return [2 /*return*/];
                            case 4: return [2 /*return*/, minutes ? parseInt(minutes.content) : 0];
                        }
                    });
                });
            }
            function getMentions(message, thisObject) {
                return __awaiter(this, void 0, void 0, function () {
                    var mentions;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, message.edit(commands_reminder_1.default.addMentions(thisObject))];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, message.channel.awaitMessages(filter, config)];
                            case 2:
                                mentions = (_a.sent()).first();
                                mentions === null || mentions === void 0 ? void 0 : mentions.delete();
                                return [2 /*return*/, mentions ? mentions.content : ''];
                        }
                    });
                });
            }
            var arg, acceptedArgs, filter, config;
            var _this = this;
            return __generator(this, function (_a) {
                arg = args[0];
                acceptedArgs = {
                    'add': function () { return __awaiter(_this, void 0, void 0, function () {
                        var newMessage, allReminderData, title, description, repeatEveryDay, date, month, year, hours, minutes, mentions, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, message.channel.send({ embed: { description: 'Carregando...' } })];
                                case 1:
                                    newMessage = _b.sent();
                                    if (!newMessage)
                                        return [2 /*return*/];
                                    allReminderData = function () {
                                        return {
                                            title: title, description: description, repeatEveryDay: repeatEveryDay, date: date, month: month, year: year, hours: hours, minutes: minutes, mentions: mentions
                                        };
                                    };
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 12, , 13]);
                                    return [4 /*yield*/, getTitle(newMessage)];
                                case 3:
                                    title = _b.sent();
                                    if (!title)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getDescription(newMessage, allReminderData())];
                                case 4:
                                    description = _b.sent();
                                    if (!description)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getRepeat(newMessage, allReminderData())];
                                case 5:
                                    repeatEveryDay = _b.sent();
                                    if (repeatEveryDay === undefined)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getDate(newMessage, allReminderData())];
                                case 6:
                                    date = _b.sent();
                                    if (!date)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getMonth(newMessage, allReminderData())];
                                case 7:
                                    month = _b.sent();
                                    if (!month)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getYear(newMessage, allReminderData())];
                                case 8:
                                    year = _b.sent();
                                    if (!year)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getHours(newMessage, allReminderData())];
                                case 9:
                                    hours = _b.sent();
                                    if (!hours)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getMinutes(newMessage, allReminderData())];
                                case 10:
                                    minutes = _b.sent();
                                    if (!minutes)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, getMentions(newMessage, allReminderData())];
                                case 11:
                                    mentions = _b.sent();
                                    if (!mentions)
                                        return [2 /*return*/];
                                    return [3 /*break*/, 13];
                                case 12:
                                    _a = _b.sent();
                                    return [2 /*return*/, newMessage.edit(commands_reminder_1.default.timeOut)];
                                case 13: return [4 /*yield*/, database_1.default.get('reminders').push({
                                        title: title, description: description, repeatEveryDay: repeatEveryDay, date: date, month: month, year: year, hours: hours, minutes: minutes, mentions: mentions
                                    }).write()];
                                case 14:
                                    _b.sent();
                                    newMessage.edit(commands_reminder_1.default.sucess('add'));
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                    'remove': function () { }
                };
                !!acceptedArgs[arg] && acceptedArgs[arg]();
                filter = function (m) { return m.author.id === message.author.id; };
                config = { max: 1, time: 1000 * 20, errors: ['time'] };
                return [2 /*return*/];
            });
        });
    }
};
