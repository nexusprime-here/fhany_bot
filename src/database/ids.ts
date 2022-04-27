import dotenv from 'dotenv';
import fs from 'fs';
import Keyv from "keyv";
import path from "path";

const hasBotEnv = fs.readdirSync(process.cwd()).map(file => file === 'bot.env').includes(true);

if(!hasBotEnv) throw new Error('Missing bot.env file');
dotenv.config({ path: path.resolve(process.cwd(), 'bot.env') });

class ModifiedKeyv<TOpts extends { [key: string]: any } = any> extends Keyv {
    constructor(uri?: string, opts?: Keyv.Options<any> & { namespace?: string }) {
        super(uri, opts);
    }

    get<KTOpts extends keyof TOpts = keyof TOpts, TRaw extends boolean = false>(key: KTOpts, options?: { raw?: TRaw }): 
        Promise<(TRaw extends false ? TOpts[KTOpts] : Keyv.DeserializedData<TOpts[KTOpts]>) | undefined> 
    {
        
        return super.get(key as string, options);
    }
    set<KTOpts extends keyof TOpts = keyof TOpts>(key: KTOpts, value: TOpts[KTOpts], ttl?: number): Promise<true> {
        return super.set(key as string, value, ttl);
    }
}

const isTest = process.argv.includes('test');
const idCache = new ModifiedKeyv<IdTypes>(`sqlite://src/database/data/${isTest ? 'guild_test_ids' : 'guild_ids'}.sqlite`);

const { GUILD_TEST_ID, GUILD_ID } = process.env;
if(!GUILD_TEST_ID || !GUILD_ID) throw new Error(`Missing ${GUILD_TEST_ID ? 'GUILD_ID' : 'GUILD_TEST_ID'} in bot.env`);

idCache.set('guildId', isTest ? GUILD_TEST_ID : GUILD_ID);

// idCache.set('professions', {
//     moderator: '964559535475925043',
//     animator: '964559653553975336'
// })

export default idCache;


/* Types */
export type IdTypes = {
    guildId: string;
    roles: {
        booster: string;
        vip: string;
        staffers: string[];
        adms: string[];
    };
    professions: { [profession: string]: string }
    channels: {
        talk: string[];
    },
    boosterCallCategory: string
};