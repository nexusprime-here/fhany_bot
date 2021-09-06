import { fixedSizeArray } from "../features/trends";
import { globalCommon } from "./global";

const invisibleKey = 'ㅤ';

export default {
    trendMessage: (hashtags: fixedSizeArray) => globalCommon()
        .setTitle('Trend Topics')
        .setFields(hashtags
            .filter((item): item is string => !!item)
            .map(field => ({ name: invisibleKey, value: field }))
        )
}
