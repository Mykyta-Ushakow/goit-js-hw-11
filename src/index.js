/* 

1. Дістати рефи та бібліотеки (зі стилями!)
2. Дістаю данні з бекенду.
3. Офромлюю слухач та асинхронну функцію для запиту за введеними користувачем данними.
    3.1 Зроби так, щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).
    3.2 Початкове значення параметра page повинно бути 1.
    3.3 З кожним наступним запитом, його необхідно збільшити на 1.
    3.4 У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового, оскільки буде пагінація по новій колекції зображень.
4. Оформити кнопку
    4.1 В початковому стані кнопка повинна бути прихована.
    4.2 Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
    4.3 При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.
    4.4 У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results."
    .
5. Додатково
    5.1 Після першого запиту з кожним новим пошуком отримувати повідомлення, в якому буде написано, скільки всього знайшли зображень (властивість totalHits). Текст повідомлення - "Hooray! We found totalHits images."
    5.2 Додати відображення великої версії зображення з бібліотекою SimpleLightbox для повноцінної галереї.
    5.3 Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.
    5.4 Замість кнопки «Load more», можна зробити нескінченне завантаження зображень під час прокручування сторінки. Ми надаємо тобі повну свободу дій в реалізації, можеш використовувати будь-які бібліотеки.

*/

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

            console.log(resp);
            console.log(resp.data);
            console.log(resp.data.hits);
            console.log(resp.data.totalHits);
            

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

            console.log(resp);
            console.log(resp.data);
            console.log(resp.data.hits);
        
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
            })
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


// window.onscroll = function(ev) {
//     if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
//         alert("you're at the bottom of the page");
//     }
// };