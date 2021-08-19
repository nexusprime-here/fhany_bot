import { IConfig } from ".."

const config: IConfig = {
    token: 'NzA5MDcyNjY5MDIyMzU1NDg2.XrglYg.HlJVQ0LdfCztxpWW_GReZulEyYg',
    guildId: '772812962397421589',

    roles: {
        adms: ['779054882916925480', '876556417425899570'],
        boosters: {
            role: '779055143815348244',
            otherRoles: ['811601064792686612']
        },
        muted: '779055012038311944',
        staffers: ['779055195028062269'],
    },

    channels: {
        suggestion: '813131329339260940',
        talk: ['772812962854338561']
    },

    commands: {
        boosterCall: {
            category: "811380652740968460"
        },
        sendNotice: {
            admChannel: '813131329339260940',
            noticeChannel: '772812962854338563'
        }
    },

    features: {
        fhanyPresenceDetector: {
            blackListChannels: [],
            whiteListChannels: [],
            fhanyId: '607999934725357578'
        },
        temporaryCalls: {
            category: '811380652740968460',
            controllerChannel: '819294096572809236'
        }
    }
}

export default config;