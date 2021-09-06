import { IConfig } from ".."

const config: IConfig = {
    token: 'ODExMjUxOTQ1NTcwMDQxODc4.YCvfQA.RUbnr2CnNu3Py9f-Ieq2y2kiXp4',
    guildId: '745049338396409886',

    roles: {
        adms: ['745055012597792816', '826227560580513852', '745054784662536383'],
        boosters: {
            role: '750451871084445788',
            otherRoles: ['750137067438342224']
        },
        muted: '750811765172076605',
        staffers: ["745054784662536383", "826227560580513852", "745055012597792816", "748601213079126027"],
    },

    channels: {
        suggestion: '812513954727067728',
        trend: '',
        talk: ["750098094695383212", "812432082747260949"]
    },

    commands: {
        boosterCall: {
            category: "745050725641486479"
        },
        sendNotice: {
            admChannel: '769325241070518295',
            noticeChannel: '745294416654106666'
        }
    },

    features: {
        trends: {},
        
        temporaryCalls: {
            category: '745352852796473517',
            controllerChannel: '811768172079218729'
        }
    }
}

export default config;