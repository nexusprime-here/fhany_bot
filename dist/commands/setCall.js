"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("../database"));
var commands_setCall_1 = __importDefault(require("../embeds/commands.setCall"));
module.exports = {
    name: 'setcall',
    description: '',
    args: true,
    usage: '<video/connect/invite> <true/false> @user',
    execute: execute
};
function execute(message, args) {
    var _a;
    var voiceChannel = getBoosterCall();
    if (!voiceChannel)
        return message.channel.send(commands_setCall_1.default.notCreatedChannel);
    var permissionsAccepted = {
        'ver': 'VIEW_CHANNEL',
        'conectar': 'CONNECT',
        'convidar': 'CREATE_INSTANT_INVITE',
        'video': 'STREAM'
    };
    var userPermission = args[0], boolean = args[1];
    if (userPermission === 'fechar' || userPermission === 'excluir')
        return function () {
            !voiceChannel.deleted && voiceChannel.delete();
            database_1.default.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();
        }();
    if (userPermission !== 'ver' && userPermission !== 'conectar' && userPermission !== 'convidar' && userPermission !== 'video')
        return message.channel.send(commands_setCall_1.default.invalidOptions(Object.keys(permissionsAccepted)));
    var permission = permissionsAccepted[userPermission];
    var taggedUser = message.mentions.users.first();
    if (!taggedUser)
        return;
    voiceChannel.updateOverwrite(taggedUser.id, (_a = {},
        _a[permission] = boolean === 'true',
        _a)).then(function () {
        message.channel.send(commands_setCall_1.default.sucessMessage(taggedUser.id, permission, boolean));
    });
    /* Functions */
    function getBoosterCall() {
        var _a;
        var user = database_1.default.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();
        var call = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(user.channelId);
        return (call === null || call === void 0 ? void 0 : call.type) === 'voice' ? call : undefined;
    }
}
