"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("../database"));
module.exports = {
    name: 'voiceStateUpdate',
    execute: function (oldState, newState, client) {
        var _a;
        if (newState.channelID !== null)
            return;
        if (!oldState.channel)
            return;
        var acceptedSymbols = ['彡', '★', '❖'];
        if (acceptedSymbols.includes(oldState.channel.name[0])) {
            if (!newState.guild)
                return;
            if (!oldState.channel)
                return;
            var channel = newState.guild.channels.cache.get(oldState.channel.id);
            if ((channel === null || channel === void 0 ? void 0 : channel.members.size) === 0) {
                !channel.deleted && channel.delete();
                database_1.default.get(oldState.channel.name[0] !== '❖' ? 'usersThatCreatedCalls' : 'boostersThatCreatedCalls')
                    .remove({ userId: (_a = oldState.member) === null || _a === void 0 ? void 0 : _a.id })
                    .write();
            }
            ;
        }
    }
};
