let windowWidth = window.innerWidth;

function getScrollBarWidth() {
    return windowWidth - document.documentElement.clientWidth;
};
let popupMenu = (el) => {
    document.querySelector('.popup').innerHTML =
        `<img class="popup__img" src="${el.img}" alt="animals's image">
    <div class="popup__content">
    <div class="popup__title">${el.name}</div>
    <div class="popup__subtitle">${el.breed}</div>
    <div class="popup__text">${el.description}</div>
        <ul class="popup__list">
                <li class="popup__list__item"><span><b>Age:</b> ${el.age}</span></li>
                <li class="popup__list__item"><span><b>Inoculations:</b> ${el.inoculations}</span></li>
                <li class="popup__list__item"><span><b>Diseases:</b> ${el.diseases}</span></li>
                <li class="popup__list__item"><span><b>Parasites:</b> ${el.parasites}</span></li>
        </ul>
    </div>`;
    openPopupMenu();

};

let openPopupMenu = () => {
    document.querySelector('.popup__wrapper').classList.add('popup__wrapper-active');
    document.querySelector('.blackout').classList.add('blackout-active');
    body.style = `margin-right: ${getScrollBarWidth()}px; overflow: hidden`;
};

let closePopupMenu = () => {
    document.querySelector('.popup__wrapper').classList.remove('popup__wrapper-active');
    document.querySelector('.blackout').classList.remove('blackout-active');
    body.style = '';
};

document.querySelector('.popup__btn').addEventListener('click', closePopupMenu);
document.querySelector('.blackout').addEventListener('click', closePopupMenu);