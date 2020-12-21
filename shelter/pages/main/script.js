let burger = document.querySelector('.burger');
let wrapperOfHeader = document.querySelector('.darkscreen');
let header = document.querySelector('.header');
let nav = document.querySelector('.nav');
let isClosed = true;

let body = document.body;
wrapperOfHeader.addEventListener('click', menuSlideOut)

function menuSlideIn() {
    body.style = `margin-right: ${getScrollBarWidth()}px; overflow-y: hidden`;
    wrapperOfHeader.classList.add('darkscreen-change');
    header.classList.add('header-active');
    document.querySelector('.intro__inner').style.marginTop = '120px';
    nav.classList.add('nav__slide');
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
        nav.classList.remove('nav__slide');
        document.querySelector('.intro__inner').style.marginTop = '60px';
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

// slider 
let pets = [];
let petsList = [];
let currList = [];

let containerCards = document.querySelectorAll('.cards__inner');
let currentItem = 0;
let sliderIsEnabled = true;

let request = new XMLHttpRequest();
request.open('GET', '../../pets.json');
request.onload = () => {
    pets = JSON.parse(request.response);

    let images = new Image();
    pets.forEach((el) => {
        images.src = el.img;
    })

    petsList = () => {
        let newList = [...pets];

        newList = newList.filter(el => !currList.includes(el))
        let newArr = [];
        for (let i = 0; i < 3; i++) {
            let ind = Math.floor(Math.random() * newList.length);
            let randElem = newList.splice(ind, 1)[0];
            newArr.push(randElem);
        }
        currList = [...newArr];
        return newArr;

    };
    createBlockCards(petsList());

}


function createBlockCards(cards) {
    let str = '';
    cards.forEach(el => str += `<div class="card">
    <img src='${el.img}'>
    <div class="card__title">${el.name}</div>
    <button class="card__btn">Learn more</button>
</div>`);
    containerCards[currentItem].innerHTML = str;
    containerCards[currentItem].childNodes.forEach((card, ind) => {
        card.addEventListener('click', () => {
            popupMenu(cards[ind]);
        })
    });
};

request.send();


function changeCurrentItem(n) {
    currentItem = (n + containerCards.length) % containerCards.length;
}

function hideItem(direction) {
    sliderIsEnabled = false;
    containerCards[currentItem].classList.add(direction);
    containerCards[currentItem].addEventListener('animationend', function() {
        this.classList.remove(direction, 'active');

    })
}

function showItem(direction) {
    createBlockCards(petsList());
    containerCards[currentItem].classList.add(direction, 'next');
    containerCards[currentItem].addEventListener('animationend', function() {
        this.classList.remove(direction, 'next');
        this.classList.add('active');
        sliderIsEnabled = true;
    })
}

function priviousItem() {
    hideItem('to-left');
    changeCurrentItem(currentItem + 1);
    showItem('from-right');
}

function nextItem() {
    hideItem('to-right');
    changeCurrentItem(currentItem - 1);
    showItem('from-left');
}

document.querySelector('.arrow-left').addEventListener('click', () => {
    if (sliderIsEnabled) {
        nextItem();
    }
});
document.querySelector('.arrow-right').addEventListener('click', () => {
    if (sliderIsEnabled) {
        priviousItem();
    }
});

const swipedetect = () => {
    let swiperElement = document.querySelector('.pets__cards');

    let startX = 0;
    let startY = 0;
    let diffX = 0;
    let diffY = 0;

    let startTime = 0;
    let diffTime = 0;

    let allowedTime = 300;
    let rangeX = 150;
    let rangeY = 100;

    swiperElement.addEventListener('mousedown', (el) => {
        startX = el.pageX;
        startY = el.pageY;
        startTime = new Date().getTime();
        el.preventDefault();

    })

    swiperElement.addEventListener('mouseup', (el) => {
        diffX = el.pageX - startX;
        diffY = el.pageY - startY;
        diffTime = new Date().getTime() - startTime;
        el.preventDefault();

        if (diffTime <= allowedTime) {
            if (Math.abs(diffX) >= rangeX && Math.abs(diffY) <= rangeY) {
                if (sliderIsEnabled) {
                    if (diffX > 0) {
                        nextItem();
                    } else priviousItem();
                }
            }
        }
    })

    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;

    });

    // swiperElement.addEventListener('touchstart', (el) => {
    //     startX = el.changedTouches[0].pageX;
    //     startY = el.changedTouches[0].pageY;
    //     startTime = new Date().getTime();
    //     el.preventDefault();

    // });

    // swiperElement.addEventListener('touchend', (el) => {
    //     diffX = el.changedTouches[0].pageX - startX;
    //     diffY = el.changedTouches[0].pageY - startY;
    //     diffTime = new Date().getTime() - startTime;
    //     el.preventDefault();

    //     if (diffX === 0 && diffY === 0) {
    //         
    //     }

    //     if (diffTime <= allowedTime) {
    //         if (Math.abs(diffX) >= rangeX && Math.abs(diffY) <= rangeY) {
    //             if (sliderIsEnabled) {
    //                 if (diffX > 0) {
    //                     nextItem();
    //                 } else priviousItem();
    //             }
    //         }
    //     }
    // });
}
swipedetect();