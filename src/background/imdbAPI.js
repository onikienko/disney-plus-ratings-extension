import {arrayShuffle, fetchUrlsWithFallback} from '../shared/utils';


const IMDB_API_MIRRORS_LIST = [
    'https://imdb-api.0-8.pp.ua',
    'https://imdb-api.cap.cmd.pp.ua',
];

const getDetailsForMovie = async (imdbMovie) => {
    if (!imdbMovie?.id) return null;
    const resp = await fetchUrlsWithFallback(arrayShuffle(IMDB_API_MIRRORS_LIST), `/title/${imdbMovie.id}`, 4000);
    return await resp.json();
};

const searchMovie = async ({movieName, startYear}) => {
    const resp = await fetchUrlsWithFallback(arrayShuffle(IMDB_API_MIRRORS_LIST), `/search?query=${movieName} ${startYear}`, 4000);
    const json = await resp.json();
    if (json.results?.length) {
        for (const result of json.results) {
            if (
                result?.title?.toString().toLowerCase() === movieName.toLowerCase() &&
                result?.year?.toString() === startYear
            )
                return result;
        }
    }
    return null;
};

export const getImdbDetails = async ({movieName, startYear}) => {
    const imdbMovie = await searchMovie({movieName, startYear});
    if (!imdbMovie) return null;
    const imdbDetails = await getDetailsForMovie(imdbMovie);
    return imdbDetails?.imdb ? imdbDetails : null;
};
