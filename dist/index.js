"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var discord_js_1 = __importDefault(require("discord.js"));
var fs_1 = __importDefault(require("fs"));
var configtest_json_1 = __importStar(require("./config/configtest.json"));
var src_index_1 = __importDefault(require("./embeds/src.index"));
exports.client = new discord_js_1.default.Client({ partials: ['REACTION'] });
var commands = new discord_js_1.default.Collection();
var commandFiles = fs_1.default.readdirSync('./dist/commands').filter(function (file) { return file.endsWith('.js'); });
var eventFiles = fs_1.default.readdirSync('./dist/events').filter(function (file) { return file.endsWith('.js'); });
for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
    var file = commandFiles_1[_i];
    var command = require("./commands/" + file);
    commands.set(command.name, command);
}
;
var _loop_1 = function (file) {
    var event_1 = require("./events/" + file);
    if (event_1.once) {
        exports.client.once(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, __spreadArray(__spreadArray([], args), [exports.client]));
        });
    }
    else {
        exports.client.on(event_1.name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return event_1.execute.apply(event_1, __spreadArray(__spreadArray([], args), [exports.client]));
        });
    }
};
for (var _a = 0, eventFiles_1 = eventFiles; _a < eventFiles_1.length; _a++) {
    var file = eventFiles_1[_a];
    _loop_1(file);
}
var cooldowns = new discord_js_1.default.Collection();
exports.client.once('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        startFeatures(exports.client);
        console.log('O bot foi iniciado com sucesso!');
        return [2 /*return*/];
    });
}); });
function startFeatures(client) {
    fs_1.default.readdir('dist/features', function (_, files) {
        try {
            files.forEach(function (file) {
                var filePath = require("./features/" + file);
                filePath.execute(client, configtest_json_1.default);
            });
        }
        catch (err) {
            console.log(err);
            process.exit(0);
        }
    });
}
;
exports.client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var args, commandName, command, authorPerms, roles_1, findRole_1, reply, now, timestamps, cooldownAmount, expirationTime, timeLeft;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        if (!message.content.startsWith(configtest_json_1.prefix) || message.author.bot)
            return [2 /*return*/];
        args = message.content.slice(configtest_json_1.prefix.length).split(/ +/);
        commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        if (!commandName)
            return [2 /*return*/];
        command = commands.get(commandName);
        if (!command)
            return [2 /*return*/];
        if (command.guildOnly && message.channel.type !== 'text') {
            return [2 /*return*/, message.reply(src_index_1.default.notDM)];
        }
        ;
        if (command.permissions) {
            if (message.channel.type !== 'text')
                return [2 /*return*/];
            if (!message.client.user)
                return [2 /*return*/];
            authorPerms = message.channel.permissionsFor(message.client.user);
            if (!authorPerms || !authorPerms.has(command.permissions))
                return [2 /*return*/];
        }
        ;
        if (command.roles) {
            roles_1 = (_c = (_b = message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(message.author.id)) === null || _c === void 0 ? void 0 : _c.roles.cache;
            command.roles.forEach(function (role) {
                findRole_1 = roles_1 === null || roles_1 === void 0 ? void 0 : roles_1.has(role);
            });
            if (!findRole_1)
                return [2 /*return*/, message.reply(src_index_1.default.missingRole(command.roles))];
        }
        if (command.args && !args.length) {
            reply = src_index_1.default.missingArgs;
            if (command.usage) {
                reply = src_index_1.default.missingArgs.setDescription("O jeito correto seria: `" + configtest_json_1.prefix + command.name + " " + command.usage + "`");
            }
            ;
            return [2 /*return*/, message.channel.send(reply)];
        }
        ;
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new discord_js_1.default.Collection());
        }
        ;
        now = Date.now();
        timestamps = cooldowns.get(command.name);
        cooldownAmount = (command.cooldown || 3) * 1000;
        if (timestamps.has(message.author.id)) {
            expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) {
                timeLeft = (expirationTime - now) / 1000;
                return [2 /*return*/, message.reply(src_index_1.default.timeNotExpired(timeLeft.toFixed(1), commandName))];
            }
            ;
        }
        ;
        timestamps.set(message.author.id, now);
        setTimeout(function () { return timestamps.delete(message.author.id); }, cooldownAmount);
        try {
            command.execute(message, args, exports.client, configtest_json_1.default);
        }
        catch (error) {
            console.error(error);
            message.reply(src_index_1.default.commandNotWork);
        }
        ;
        return [2 /*return*/];
    });
}); });
exports.client.login(configtest_json_1.token);
