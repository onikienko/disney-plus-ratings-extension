import './disney.css';


export const injectRatio = (imdbDetails) => {
    const parent = document.querySelector('#details_index > div > article > div.sc-hTQSVH.cUDiDZ > div > div:nth-child(1) > p > div > div.sc-fyjYeE.eLawYF');
    if (!parent) return;
    const container = document.createElement('div');
    container.id = 'ext-details-container';
    container.innerHTML = `
    <span class="dpe-0">
        <a 
            class="dpe-1" 
            href="${imdbDetails.imdb}" 
            target="_blank"
            title="IMDb Rating\nBased on ${imdbDetails.rating.count} reviews"
        >
            <span>⭐</span> ${imdbDetails.rating.star}
        </a>
    </span>
    `;
    parent.appendChild(container);
};
