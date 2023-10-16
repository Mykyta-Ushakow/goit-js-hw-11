import axios from "axios";
import Notiflix from "notiflix";

let page = 1;
const perPage = 40;

const refs = {
    submitBtn: document.querySelector(".submit-btn"),
    searchForm: document.querySelector(".search-form"),
    galleryEl: document.querySelector(".gallery"),
    loadMore: document.querySelector(".load-more")
}

const { galleryEl, submitBtn, searchForm, loadMore } = refs;

searchForm.addEventListener("submit", imagesService);
loadMore.addEventListener("click", handleLoadMore);

function imagesService(event) {
    event.preventDefault();
    submitBtn.disabled = true;
    loadMore.classList.add('hidden');

    page = 1;
        
    const submitData = new FormData(event.currentTarget);
    const qValue = submitData.get("searchQuery").trim();

    if (!qValue) {
        Notiflix.Notify.warning("Please enter your query", {
                width: '500px',
                svgSize: '120px',
                clickToClose: true,
                pauseOnHover: true,
                fontSize: '26px',
        });
        submitBtn.disabled = false;
        return;
    }

    getImages(qValue)
        .then(resp => {      

            if (resp.data.hits.length === 0) {
                throw new Error('Sorry, there are no images matching your search query. Please try again.');
            }
        
            const markup = createMarkup(resp.data.hits);
            galleryEl.innerHTML = markup;
            
            if (resp.data.totalHits > perPage) {
                loadMore.classList.remove('hidden');   
            }       
        
        })
        .catch(err => {
            Notiflix.Notify.failure(`${err}`, {
                width: '500px',
                svgSize: '120px',
                clickToClose: true,
                pauseOnHover: true,
                fontSize: '26px',
            })
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
}

async function getImages(qValue) {
    const BASE_URL = "https://pixabay.com/api/"
    const URL_PARAMS = new URLSearchParams({
        key: "40067748-747d8141c6ab6be87462ec83d",
        q: qValue,
        image_type: "photo",
        orientation: "hprizontal",
        safesearch: true,
        page: page,
        per_page: perPage,
    });
        
    return await axios.get(`${BASE_URL}?${URL_PARAMS}`);
}

function createMarkup(arr) {

    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
    <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                ${likes}
                <b>Likes</b>
            </p>
            <p class="info-item">
                ${views}
                <b>Views</b>
            </p>
            <p class="info-item">
                ${comments}
                <b>Comments</b>
            </p>
            <p class="info-item">
                ${downloads}
                <b>Downloads</b>
            </p>
        </div>
    </div>
    `).join("");
}

function handleLoadMore(event) {
    event.preventDefault();
    page++;

    const submitData = new FormData(searchForm);
    const qValue = submitData.get("searchQuery");

    getImages(qValue)
        .then(resp => {
        
            const markup = createMarkup(resp.data.hits);
            galleryEl.insertAdjacentHTML("beforeend", markup);

            if (galleryEl.children.length >= resp.data.totalHits) {
                loadMore.classList.add("hidden");

                Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.", {
                    width: '500px',
                    svgSize: '120px',
                    clickToClose: true,
                    pauseOnHover: true,
                    fontSize: '26px',
                });
            }

        })
        .catch(err => {

            Notiflix.Notify.failure(`${err}`, {
                width: '500px',
                svgSize: '120px',
                clickToClose: true,
                pauseOnHover: true,
                fontSize: '26px',
            })
        });
}