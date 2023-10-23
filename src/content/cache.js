import Dexie from 'dexie';


const db = new Dexie('DPRExtension');

db.version(1).stores({
    rCache: 'did, ts',
});

export const putToCache = (disneyId, imdbDetails) => {
    db.table('rCache').put({
        did: disneyId,
        ts: Date.now(),
        imdbDetails,
    });
};

export const getFromCache = (disneyId) => {
    return db.table('rCache').get(disneyId);
};

export const cleanupCache = async () => {
    const now = Date.now();
    if (!localStorage['lastCacheCleanupTs']) {
        localStorage['lastCacheCleanupTs'] = now;
        return;
    }
    const CACHE_LIFETIME_MSEC = 1000 * 60 * 60 * 24 * 2; // 2 days
    const CLEANUP_INTERVAL_MSEC = 1000 * 60 * 60 * 24; // 1 day
    if (CLEANUP_INTERVAL_MSEC + parseInt(localStorage['lastCacheCleanupTs'], 10) > now) return;
    const toRemove = await db.table('rCache').where('ts').belowOrEqual(now - CACHE_LIFETIME_MSEC).toArray();
    if (toRemove?.length) {
        await db.table('rCache').bulkDelete(toRemove.map(el => el.did));
    }
    localStorage['lastCacheCleanupTs'] = now;
};
