// Uses the Durstenfeld algorithm which is based on the Fisher–Yates algorithm.
// Https://github.com/sindresorhus/array-shuffle/blob/main/index.js
export const arrayShuffle = (array) => {
    if (!Array.isArray(array)) {
        throw new TypeError(`Expected an array, got ${typeof array}`);
    }
    array = [...array];
    for (let index = array.length - 1; index > 0; index--) {
        const newIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }
    return array;
};
export const handleFetchRespErrors = (response) => {
    if (!response.ok) {
        throw Error(`${response.status}: ${response.statusText}`);
    }
    return response;
};
export const fetchUrlsWithFallback = async (baseUrls, suffix = '', msec = 5000) => {
    for (const url of baseUrls) {
        try {
            return await fetch(url + suffix, {signal: AbortSignal.timeout(msec)}).then(handleFetchRespErrors);
        } catch (error) {
            console.log('Error fetching ', url);
        }
    }
    throw new Error('No working urls');
};
