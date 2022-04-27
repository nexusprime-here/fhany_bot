import { JSONFile, Low } from 'lowdb';

export type DefaultData = {
    boosterCalls: { channelId: string, userId: string }[],
    suggestions: [],
    hashtags: { [hashtag: string]: number }
};

declare class ModifiedLow<T> extends Low<T> {
    data: T;
}

const adapter = new JSONFile<DefaultData>(__dirname + '/data/data.json');
export const cache = <ModifiedLow<DefaultData>>new Low(adapter);

cache.read().then(async () => {
    if(cache.data) return;
    
    cache.data = {
        boosterCalls: [],
        suggestions: [],
        hashtags: {},
    }

    await cache.write();
    await cache.read();
});

export default cache;