// imports -------------------------------------------------------------------

import axios from 'axios';
import { refs } from './refs';
import { BookAPI } from './api-service';
import { handleRenderCategoryItem } from './render-bookByType';
import { loaderRender } from './preloader';
import { handleDataBookById } from './render-bookByType';
import { renderBooksByType } from './render-books';
// code -------------------------------------------------------------------
const bookApi = new BookAPI();
// variables -------------------------------------------------------------------

// getBooksRender();
renderBestsellersBooks();
// -------------------------------------------------------------------
let currentRenderWidth = window.innerWidth;
// resolution viwe
addEventListener('resize', event => {
  if (
    (window.innerWidth > 767 && currentRenderWidth < 768) ||
    (window.innerWidth > 1279 && currentRenderWidth < 1280) ||
    (window.innerWidth < 1280 && currentRenderWidth > 1279) ||
    (window.innerWidth < 768 && currentRenderWidth > 767)
  ) {
    location.reload();
  }
});

export async function renderBestsellersBooks() {
  const preloader = document.getElementById('preloader');

  preloader.classList.remove('done'); // показую спінер

  // refs.galleryContainer.innerHTML = '';
  let currentRenderWidth = window.innerWidth;
  let amountRenderedBooks = 1;

  if (currentRenderWidth < 768) {
    amountRenderedBooks = 1;
  } else if (currentRenderWidth > 767 && currentRenderWidth < 1280) {
    amountRenderedBooks = 3;
  } else {
    amountRenderedBooks = 5;
  }

  let bestsellersBooks = await bookApi.getBooksTop();
  // let bestsellersBooks = response;
  // console.log('bestsellersBooks', bestsellersBooks);
  bestsellersBooks = bestsellersBooks.map(type => {
    return { ...type, books: type.books.slice(0, amountRenderedBooks) };
  });

  // const booksCcontainerEl = document.querySelector('.book-card__list');
  // console.log('booksList', refs.galleryContainer);

  refs.galleryContainer.innerHTML = await renderBestsellersBooksList(
    bestsellersBooks
  );

  const seeMoreBtn = document.querySelectorAll('.book-card__btn');

  seeMoreBtn.forEach(el => {
    el.addEventListener('click', handleSeeMore);

    function handleSeeMore(ev) {
      const category = ev.target.dataset.category.trim();

      refs.book_card__title.innerHTML = `${category.slice(
        0,
        category.lastIndexOf(' ')
      )}<span class="book-card__filter"> ${category.split(' ').pop()}</span>`;
      const listCategory = document.querySelectorAll('.category');
      listCategory.forEach(el => {
        el.dataset.id.trim() === category
          ? el.classList.add('is-active')
          : el.classList.remove('is-active');
      });
      // console.log('refs.galleryContainer', refs.galleryContainer);

      handleRenderCategoryItem(category);
    }
  });
  loaderRender();
}

// render-books -------------------------------------------------------------------
export function renderBestsellersBooksList(data) {
  // console.log('renderBestsellersBooksList(data)', data);
  const markup = data
    .map(typeBooks => {
      return `
          <li class="bestsellers-typeBooks">
          <h3 class="title">${typeBooks.list_name}</h3>
      
            <ul class="booksList"> 
            ${typeBooks.books
              .map(book => renderBestsellersBook(book, typeBooks))
              .join('')}
            </ul>
            
          <div class="btnBox">
          <button class="book-card__btn" type="button" data-category="${
            typeBooks.list_name
          }">see more</button>
            </li>`;
    })
    .join('');
  // console.log('refs.galleryContainer в букс', refs.galleryContainer);
  return markup;
  // refs.galleryContainer.insertAdjacentHTML('beforeEnd', markup);
}

export function renderBestsellersBook(book, typeBooks) {
  return `
     <li class="book-card__item" >
      <a class="book-card__link" href="#">
          <div class="book-card__wrapper"  data-type="${typeBooks.list_name}">
              <img
              class="book-card__image"
              src="${book.book_image ? book.book_image : ``}"
              alt="${book.title}"
              loading="lazy"
            data-id="${book._id}"
              />
              <div class="book-card__overlay" data-id="${book._id}">
              <p class="book-card__quick-view-text">quick view</p>
          </div>
          </div>
      </a>
           <div class="book-card__wrap">
            <h3 class="book-card__name">${
              book.title.length > 14
                ? book.title.slice(0, 14) + '...'
                : book.title
            }</h3>
            <p class="book-card__author">${
              book.author.length > 28
                ? book.author.slice(0, 28) + '...'
                : book.author
            } </p>
          </div>
   
     </li>`;
}

// const categoryBooksEl = document.querySelector('.book-card__list');
refs.galleryContainer.addEventListener('click', handleDataBookById);

// -----
