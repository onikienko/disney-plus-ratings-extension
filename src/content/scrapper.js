const getYears = () => {
    // may look like that 2011 - 2022 • 11 Seasons
    const span = document.querySelector('#details_index > div > article > div > div > div:nth-child(1) > p > div > div > span');
    const years = span?.textContent?.split('•');
    return years?.length === 2 ? years[0].trim() : null;
};
export const getStartYear = () => {
    const startYear = getYears()?.split('-')?.[0]?.trim();
    return /\d{4}/.test(startYear) ? startYear : null;
};

// IDs may look like
// 3de52zcRJZGt - https://www.disneyplus.com/series/station-19/3de52zcRJZGt
// 3iHQtD1BDpgN - https://www.disneyplus.com/series/secret-invasion/3iHQtD1BDpgN
// 4cwuT9k2DFVY - https://www.disneyplus.com/movies/avatar-the-deep-dive-a-special-edition-of-20-20/4cwuT9k2DFVY
// 7daDvpFdBXPs - https://www.disneyplus.com/movies/black-is-king/7daDvpFdBXPs
// 7OLRMMgd1vkx
// dbko8SML1qB8
// assume that ID is at the end of the path and always has 12 characters (numbers and a-z)
export const getDisneyId = () => {
    const id = location.href.split('/').pop();
    return /^[0-9a-zA-Z]{12}$/.test(id) ? id : null;
};
