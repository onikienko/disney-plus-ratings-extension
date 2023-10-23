import {CMD_GET_MOVIE_INFO} from '../shared/constants';
import {getMovieName} from './disneyScrapper';
import {getImdbDetails} from './imdbAPI';


const handleIMDB = async ({startYear, pageUrl}) => {
    const movieName = await getMovieName(pageUrl);
    if (!movieName) return null;
    const imdbDetails = await getImdbDetails({movieName, startYear});
    return imdbDetails ?? null;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.cmd) {
        case CMD_GET_MOVIE_INFO:
            handleIMDB(message.data)
                .then(results => sendResponse(results))
                .catch(error => {
                    console.log('imdb handling error', error);
                    sendResponse(null);
                });
            return true;
    }
});
