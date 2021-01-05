let time = document.getElementById('time');
let greeting = document.getElementById('greeting');
let name = document.getElementById('name');
let yourFocus = document.getElementById('focus');
let dateString = document.querySelector('.date');
let btnBackground = document.getElementById('change');
const btnQuote = document.querySelector('.quote-img');
const weatherIcon = document.querySelector('.weather-icon');
const temprature = document.querySelector('.temp');
const weatherDesc = document.querySelector('.weather-description');
const windAndHumidity = document.querySelector('.wind__humidity');
const city = document.querySelector('.city');

let globalHours = new Date().getHours();
let listImagesName = [];
let ArrOfPathsToImgs = [];

const timesDayArr = ['night', 'morning', 'day', 'evening'];

function createlistImagesName() {
    for (let i = 1; i <= 20; i++) {
        let imgName = i + '';
        if (imgName < 10) {
            imgName = '0' + imgName;
        }
        listImagesName.push(imgName);
    }
};

function createArrOfPathsToImgs() {
    timesDayArr.forEach(el => {
        let tempArr = [...listImagesName];
        for (let i = 0; i < 6; i++) {

            let randNum = Math.floor(Math.random() * tempArr.length);
            let randElement = tempArr.splice(randNum, 1)[0];
            ArrOfPathsToImgs.push(`${el}/${randElement}.jpg`);

        }
    })
};


function showTime() {
    let today = new Date();
    // let today = new Date(2020, 12, 24, 1, 0);
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    // let amPm = hours > 12 ? 'PM' : 'AM';
    // hours = hours % 12 || 12;
    if (globalHours !== hours) {
        setBgGreet();
        globalHours = hours;
    }
    time.innerHTML = `<span>${hours}</span>:<span>${addZero(minutes)}</span>:<span>${addZero(seconds)}</span>`;

    dateString.innerHTML =
        today.toLocaleString('en-US', { weekday: 'long' }) + ', ' +
        today.toLocaleString('en-US', { month: 'long' }) + ' ' +
        today.getDate();

    setTimeout(showTime, 1000);
}

// add zeros

function addZero(n) {
    return parseInt(n, 10) < 10 ? '0' + n : n;
};

// set background and greeting

function setBgGreet() {
    let today = new Date();
    // let today = new Date(2020, 12, 24, 15, 0);
    let hour = today.getHours();

    if (hour < 6) {
        //night
        document.body.style.backgroundImage = `url(./assets/images/${ArrOfPathsToImgs[hour]})`;
        greeting.textContent = 'Good night';
    } else if (hour < 12) {
        // morning
        document.body.style.backgroundImage = `url(./assets/images/${ArrOfPathsToImgs[hour]})`;
        greeting.textContent = 'Good morning';
    } else if (hour < 18) {
        // afternoon
        document.body.style.backgroundImage = `url(./assets/images/${ArrOfPathsToImgs[hour]})`
        greeting.textContent = 'Good afternoon';
    } else if (hour < 24) {
        //evening
        document.body.style.backgroundImage = `url(./assets/images/${ArrOfPathsToImgs[hour]})`;
        greeting.textContent = 'Good evening';
        document.body.style.color = 'white'
    }

}

// get name 

function getName() {
    if (localStorage.getItem('name') === null) {
        name.textContent = '[enter your name]';
        localStorage.setItem('name', name.textContent);
    } else name.textContent = localStorage.getItem('name');
};
// get focus
function getFocus() {
    if (localStorage.getItem('focus') === null) {
        yourFocus.textContent = '[enter your focus]';
        localStorage.setItem('focus', yourFocus.textContent);
    } else yourFocus.textContent = localStorage.getItem('focus');
};

// set name

function setName(e) {
    if (e.type === "click") {
        e.target.innerText = '';
    } else if (e.type === 'keypress') {
        if (e.charCode == 13 || e.which == 13) {
            name.blur();
        }
    } else {
        if (e.target.innerText.trim() === '') {
            e.target.innerText = localStorage.getItem('name');
        } else {
            localStorage.setItem('name', e.target.innerText);
        }
    }
};

// set focus

function setFocus(e) {
    if (e.type === "click") {
        e.target.innerText = '';
    } else if (e.type === 'keypress') {
        if (e.charCode == 13 || e.which == 13) {
            yourFocus.blur();
        }
    } else {
        if (e.target.innerText.trim() === '') {
            e.target.innerText = localStorage.getItem('focus');
        } else {
            localStorage.setItem('focus', e.target.innerText);
        }
    }
};

// change background

let counter = 1;

function changeBgGreet() {
    let step = (counter + new Date().getHours()) % 24;
    const src = `./assets/images/${ArrOfPathsToImgs[step]}`;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${src})`;
    }
    counter++;
};

// quiote

async function getQuote() {
    const url = `https://favqs.com/api/qotd`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.quote.body.length, res.status)
    if (data.quote.body.length < 80) {
        getQuote();
    } else document.querySelector('.quote__text').textContent = data.quote.body;

}

// get weather

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=5bcb2822905df034dbb80f9950abbe9b&units=metric`;
    const res = await fetch(url);
    let data = await res.json();
    console.log(data);
    if (data.cod === 200) {
        localStorage.setItem('city', city.textContent);
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temprature.textContent = `${data.main.temp} °C`;
        weatherDesc.textContent = `${data.weather[0].description},`;
        windAndHumidity.textContent = `wind: ${data.wind.speed} m/s, humidity: ${data.main.humidity}%`

    } else {
        city.textContent = 'city is not found';
    }

}

// set city

function setCity(e) {
    if (e.type === 'click') {
        city.textContent = '';
    } else if (e.key === 'Enter') {
        city.blur();
    } else if (e.type === 'blur') {
        console.log('blur')
        if (e.target.innerText.trim() === '') {
            e.target.innerText = localStorage.getItem('city');
        } else {
            city.textContent = e.target.innerText;
            getWeather();
        }
    }

};

// get city 

function getCity() {

    if (localStorage.getItem('city') === null) {
        city.textContent = 'Kotlas';
        localStorage.setItem('city', city.textContent);
    } else {
        city.textContent = localStorage.getItem('city');
    }

}


// listeners

name.addEventListener('keypress', setName);
name.addEventListener('click', setName);
name.addEventListener('blur', setName);
yourFocus.addEventListener('keypress', setFocus);
yourFocus.addEventListener('click', setFocus);
yourFocus.addEventListener('blur', setFocus);
btnBackground.addEventListener('click', changeBgGreet);
btnQuote.addEventListener('click', getQuote);
document.addEventListener('DOMContentLoaded', getQuote);
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('click', setCity);
city.addEventListener('blur', setCity);

// run
createlistImagesName();
createArrOfPathsToImgs();
showTime();
setBgGreet();
getName();
getFocus();
getCity();