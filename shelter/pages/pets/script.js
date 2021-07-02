let burger = document.querySelector('.burger');
let wrapperOfHeader = document.querySelector('.darkscreen');
let header = document.querySelector('.header__inner');
let nav = document.querySelector('.header__nav');
let isClosed = true;


let body = document.body;

wrapperOfHeader.addEventListener('click', menuSlideOut)

function menuSlideIn() {
    body.style = `margin-right: ${getScrollBarWidth()}px; overflow-y: hidden`;
    wrapperOfHeader.classList.add('darkscreen-change');
    header.classList.add('header-active');
    nav.classList.add('header__nav-slide');
    burger.style.transform = 'rotate(-90deg)';
    header.classList.add('slide-in');

    function runMenu() {
        header.classList.remove('slide-in');
        header.removeEventListener('animationend', runMenu);
    }
    header.addEventListener('animationend', runMenu);
    isClosed = false;
};

function menuSlideOut() {
    wrapperOfHeader.classList.remove('darkscreen-change');
    burger.style.transform = 'rotate(0deg)';
    header.classList.add('slide-out');

    function closeMenu() {
        nav.classList.remove('header__nav-slide');
        header.classList.remove('header-active', 'slide-out');
        header.removeEventListener('animationend', closeMenu);
        body.style = '';
    }
    header.addEventListener('animationend', closeMenu);
    isClosed = true;
};

burger.onclick = function() {
    if (isClosed) {
        menuSlideIn();

    } else {
        menuSlideOut();


    }
};

let pets = [];
let listPets = [];
let containerCards = document.querySelector('.pets__cards');

let request = new XMLHttpRequest();
request.open('GET', '../../pets.json');
request.onload = () => {
    pets = JSON.parse(request.response);

    for (let i = 0; i < 6; i++) {
        let randomPetsList = [];
        let newPets = [...pets];

        for (let i = 0; i < 8; i++) {
            let randInd = Math.floor(Math.random() * newPets.length);
            let randEl = newPets.splice(randInd, 1);
            randomPetsList.push(randEl[0]);

        }
        listPets = listPets.concat(randomPetsList);
    };
    listPets = sort6(listPets);
    checkLimitElements();
    createElements(limitElements, position);
};

request.send();

function sort6(arr) {
    let lineOfElements;

    for (let i = 0; i < arr.length; i += 6) {
        lineOfElements = arr.slice(i, i + 6);
        for (let j = 0; j < lineOfElements.length; j++) {
            let repeatedElement = lineOfElements.find((el, ind) => {
                return el.name === lineOfElements[j].name && j !== ind;
            })
            if (repeatedElement !== undefined) {
                let wichOf8 = Math.floor((i + j) / 8);
                arr.splice(wichOf8 * 8, 0, arr.splice((i + j), 1)[0]);
                sort6(arr);
            }
        }
    };
    return arr;
};

let position = 0;
let createElements = (num, position) => {
    let visibleElements = listPets.slice(position, num);
    containerCards.innerHTML = displayElements(visibleElements);
    containerCards.childNodes.forEach((el, ind) => {
        el.addEventListener('click', () => {
            popupMenu(visibleElements[ind]);
        });
    });

};

let displayElements = (elements) => {

    let str = '';
    elements.forEach(el => {
        str += `<div class="cards__item">
        <img src='${el.img}' alt="card image" class="img">
        <div class="cards__title">${el.name}</div>
        <button class="cards__btn">Learn more</button>
        </div>`;

    });
    return str;
};

let limitElements = 8;

let checkLimitElements = () => {

    if (window.innerWidth >= 1280) {
        limitElements = 8;
    } else if (window.innerWidth < 1280) {
        if (window.innerWidth < 768) {
            limitElements = 3;
        } else limitElements = 6;
    }
    return limitElements;
};

let digitalBtn = document.querySelector('.navigation__btn-active');
let countPages = 1;
const firstPageBtn = document.querySelector('.navigation__first');
const nextPageBtn = document.querySelector('.navigation__next');
const prevPageBtn = document.querySelector('.navigation__prev');
const lastPageBtn = document.querySelector('.navigation__last');
let numOfElements;


function desableButton(button1, button2) {
    button1.classList.add('navigation__btn-inactive');
    button2.classList.add('navigation__btn-inactive');
};

function enableButton(button1, button2) {
    button1.classList.remove('navigation__btn-inactive');
    button2.classList.remove('navigation__btn-inactive');
};

function setInitialPage() {
    position = 0;
    countPages = 1;
    desableButton(firstPageBtn, prevPageBtn);
    enableButton(lastPageBtn, nextPageBtn);
};

let isPageEnable = true;

nextPageBtn.addEventListener('click', function() {
    if (countPages < listPets.length / limitElements && isPageEnable) {
        if (countPages === 1) {
            enableButton(firstPageBtn, prevPageBtn);
        };
        position += limitElements;
        countPages++;
        numOfElements = position + limitElements;
        switchPage(numOfElements, position);
        if (countPages === listPets.length / limitElements) {
            desableButton(lastPageBtn, nextPageBtn);
        }
    }
});

prevPageBtn.addEventListener('click', function() {
    if (countPages > 1 && isPageEnable) {
        if (countPages === listPets.length / limitElements) {
            enableButton(lastPageBtn, nextPageBtn);
        }
        position -= limitElements;
        countPages--;
        numOfElements = position + limitElements;
        switchPage(numOfElements, position);
        if (countPages === 1) {
            desableButton(firstPageBtn, prevPageBtn);
        }
    }
});

lastPageBtn.addEventListener('click', function() {
    if (countPages !== listPets.length / limitElements && isPageEnable) {
        countPages = listPets.length / limitElements;
        position = listPets.length - limitElements;
        numOfElements = listPets.length;
        switchPage(numOfElements, position);
        desableButton(lastPageBtn, nextPageBtn);
        enableButton(firstPageBtn, prevPageBtn);
    }

});

firstPageBtn.addEventListener('click', function() {
    if (countPages > 1 && isPageEnable) {
        setInitialPage();
        switchPage(limitElements, position);
    }
});

window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    checkLimitElements();
    setInitialPage();
    digitalBtn.innerHTML = countPages;
    createElements(limitElements, position);
    // createElements(listPets, limitElements);

});

function switchPage(elementsOfPage, startPositionOfElements) {

    containerCards.classList.add('fade-out');
    digitalBtn.innerHTML = countPages;
    isPageEnable = false;
    containerCards.addEventListener('transitionend', finishAnimation);

    function finishAnimation() {
        isPageEnable = true;
        createElements(elementsOfPage, startPositionOfElements);
        containerCards.classList.remove('fade-out');
        containerCards.removeEventListener('transitionend', finishAnimation);

    }



};
