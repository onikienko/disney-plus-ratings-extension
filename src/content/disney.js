import {CMD_GET_MOVIE_INFO} from '../shared/constants';
import {getMovieNameFromDisneyPageTitle} from '../shared/utils';
import {cleanupCache, getFromCache, putToCache} from './cache';
import {injectRatio} from './injector';
import {getDisneyId, getStartYear} from './scrapper';


const getMovieName = () => {
    const lang = document.documentElement.lang;
    return lang === 'en' || lang.startsWith('en-') ? getMovieNameFromDisneyPageTitle(document.title) : null;
};

const handleMovie = async ({startYear, disneyId}) => {
    const cached = await getFromCache(disneyId);
    if (cached) {
        injectRatio(cached.imdbDetails);
        return;
    }
    const res = await chrome.runtime.sendMessage({
        cmd: CMD_GET_MOVIE_INFO,
        data: {
            startYear,
            pageUrl: location.href,
            movieName: getMovieName(),
        },
    });
    if (res) {
        injectRatio(res);
        putToCache(disneyId, res);
        cleanupCache().catch(error => console.log('Error cleaning up cache', error));
    }
};

const mutationHandler = (mutationList) => {
    for (const mutation of mutationList) {
        if (
            (mutation.addedNodes.length && mutation.target.id === 'details_index') ||
            (mutation.target.id === 'app_body_content' && mutation.previousSibling.id === 'webAppScene')
        ) {
            const startYear = getStartYear();
            if (!startYear) continue;

            const disneyId = getDisneyId();
            if (!disneyId) continue;
            handleMovie({startYear, disneyId}).catch(err => console.log('Error handling movie', err));
            break;
        }
    }
};

const observer = new MutationObserver(mutationHandler);
observer.observe(document.getElementById('webAppRoot'), {childList: true, subtree: true});
