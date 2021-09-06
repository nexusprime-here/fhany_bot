import { IConfig } from ".."

const config: IConfig = {
    token: 'NzA5MDcyNjY5MDIyMzU1NDg2.XrglYg.HlJVQ0LdfCztxpWW_GReZulEyYg',
    guildId: '879421510522138714',

    roles: {
        adms: ['879423018311499838'],
        boosters: {
            role: '879423165720330276',
            otherRoles: ['880076793137233960']
        },
        muted: '879424924199047189',
        staffers: ['879423277704044566'],
    },

    channels: {
        suggestion: '879423376786071572',
        trend: '881899130300039168',
        talk: ['879421510522138717']
    },

    commands: {
        boosterCall: {
            category: "879422024739606549"
        },
        sendNotice: {
            admChannel: '813131329339260940',
            noticeChannel: '772812962854338563'
        }
    },

    features: {
        trends: {},
        
        temporaryCalls: {
            category: '879422024739606549',
            controllerChannel: '879422041873330176'
        }
    }
}

export default config;