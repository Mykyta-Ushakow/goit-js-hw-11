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

const page = 1;

const refs = {
    submitBtn: document.querySelector(".submit-btn"),
    searchForm: document.querySelector(".search-form"),
    loadMore: document.querySelector(".load-more")
}

const { submitBtn, searchForm, loadMore } = refs;


console.log(submitBtn);
console.log(searchForm);
console.log(loadMore);

searchForm.addEventListener("submit", imagesService);

function imagesService(event) {
    event.preventDefault();

    const submitData = new FormData(event.currentTarget);
    const qValue = submitData.get("searchQuery");

    console.log(getImages(qValue));

    // for (const [key, value] of submitData) {
    //     console.log(`${key}: ${value}\n`);
    // }
}

async function getImages(qValue) {
    
    const BASE_URL = "https://pixabay.com/api/"
    const URL_PARAMS = new URLSearchParams({
        key: "40067748-747d8141c6ab6be87462ec83d",
        q: qValue,
        image_type: "photo",
        orientation: "hprizontal",
        safesearch: true,
    });
    
    const resp = await axios.get(`${BASE_URL}?${URL_PARAMS}`);

    return resp;
}