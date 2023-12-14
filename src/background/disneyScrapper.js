import {getMovieNameFromDisneyPageTitle, handleFetchRespErrors} from '../shared/utils';


// url can be like that https://www.disneyplus.com/cs-cz/series/goosebumps/5Y5xxOokEURA
// https://www.disneyplus.com/cs-cz/movies/assembled-the-making-of-secret-invasion/4tFXzEyFWBg4
// need to remove language part (cs-cz/) because we need movie name in english,
// so url should look like https://www.disneyplus.com/series/goosebumps/5Y5xxOokEURA
const getCleanUrl = (pageUrl) => {
    const url = new URL(pageUrl);
    const pathnameArr = url.pathname.split('/');
    if (pathnameArr.length === 5) {
        // we have language in the url. remove it
        pathnameArr.splice(1, 1);
    }
    url.pathname = pathnameArr.join('/');
    return url.toString();
};

export const getMovieName = async (pageUrl) => {
    const url = getCleanUrl(pageUrl);
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        credentials: 'omit',
        headers: {
            'Accept-Language': 'en',
        },
        referrerPolicy: 'no-referrer',
    }).then(handleFetchRespErrors);
    const text = await response.text();
    const title = text.match(/<title>(.+?)<\/title>/)?.[1]?.trim();
    return getMovieNameFromDisneyPageTitle(title);
};
