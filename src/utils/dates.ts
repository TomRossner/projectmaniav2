import { DateTime } from "luxon";

const getHowLongAgo = (date: Date): string => {
    if (!date) return '';
    const howLongAgo = DateTime
        .fromISO(date.toString())
        .toRelative();
    
    return howLongAgo?.startsWith('0')
        ? 'Just now'
        : howLongAgo as string;
}

export {
    getHowLongAgo,
}