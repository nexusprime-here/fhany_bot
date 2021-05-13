"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("../database"));
var commands_setCall_1 = __importDefault(require("../embeds/commands.setCall"));
module.exports = {
    name: 'setcanal',
    description: 'Modifica permissões de usuários',
    booster: true,
    usage: '<transmitir/conectar/convidar/ver> <on/off> @user',
    execute: execute
};
function execute(message, args, client, config) {
    var _a;
    var _b, _c;
    var permissionsAccepted = {
        'ver': 'VIEW_CHANNEL',
        'conectar': 'CONNECT',
        'convidar': 'CREATE_INSTANT_INVITE',
        'transmitir': 'STREAM'
    };
    var moderator = '748601213079126027';
    var userPermission = args[0], keymode = args[1];
    console.log(config);
    if (!userPermission)
        return message.reply(commands_setCall_1.default.help(config.prefix, this.name, (_b = message.client.user) === null || _b === void 0 ? void 0 : _b.id));
    var voiceChannel = getBoosterCall();
    if (!voiceChannel)
        return message.channel.send(commands_setCall_1.default.notCreatedChannel);
    var boolean = keymode === 'on' ? true : false;
    if (userPermission === 'fechar' || userPermission === 'excluir')
        return function () {
            !voiceChannel.deleted && voiceChannel.delete();
            database_1.default.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();
        }();
    if (userPermission !== 'ver' && userPermission !== 'conectar' && userPermission !== 'convidar' && userPermission !== 'transmitir')
        return message.channel.send(commands_setCall_1.default.invalidOptions(Object.keys(permissionsAccepted)));
    var permission = permissionsAccepted[userPermission];
    var taggedUser = message.mentions.users.first();
    if (!taggedUser)
        return;
    var user = (_c = message.guild) === null || _c === void 0 ? void 0 : _c.members.cache.get(taggedUser.id);
    if (user === null || user === void 0 ? void 0 : user.roles.cache.has(moderator))
        return commands_setCall_1.default.isModerator;
    voiceChannel.updateOverwrite(taggedUser.id, (_a = {},
        _a[permission] = boolean === true,
        _a)).then(function () {
        message.channel.send(commands_setCall_1.default.sucessMessage(taggedUser.id, permission, boolean));
    });
    /* Functions */
    function getBoosterCall() {
        var _a;
        var user = database_1.default.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();
        var call = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(user === null || user === void 0 ? void 0 : user.channelId);
        return (call === null || call === void 0 ? void 0 : call.type) === 'voice' ? call : undefined;
    }
}
