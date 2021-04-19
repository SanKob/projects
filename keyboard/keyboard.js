let keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keysCode: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8',
            'Digit9', 'Digit0', 'Backspace', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU',
            'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'ShiftLeft',
            'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL',
            'Semicolon', 'Quote', 'Enter', 'done', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM',
            'Comma', 'Period', 'Slash', 'lang', 'Space', 'ArrowLeft', 'ArrowRight'
        ],
        keys: []
    },
    properties: {
        capslock: false,
        shift: false,
        language: 'en',
        volum: true,
        voice: false,
        recognition: '',
        value: ''
    },
    textarea: document.querySelector('.textarea'),
    value: '',
    init() {
        // create main elements

        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        // add classes

        this.elements.main.classList.add('keyboard', 'keyboard-hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');


        // add elements to DOM

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        this.textarea.addEventListener('focus', (ev) => {
            keyboard.open();

        });
        this._createKeys();
        this.createAudioTegs();

        this.speechToText = this.speechToText.bind(this);



    },
    open() {
        this.elements.main.classList.remove('keyboard-hidden');
    },
    close() {
        this.elements.main.classList.add('keyboard-hidden');
    },
    createButtonIcon(keyName) {
        return `<i class="material-icons">${keyName}</i>`;
    },
    displayCursor() {
        this.textarea.focus();
    },
    illuminateKey(key) {
        key.classList.add('keyboard__keys--pressed');
        setTimeout(() => {
            key.classList.remove('keyboard__keys--pressed')
        }, 200);

    },

    handleInput(value) {
        let cursorPos = this.textarea.selectionStart;
        let textBeforeCursor = this.textarea.value.slice(0, cursorPos);
        let textAfterCursor = this.textarea.value.slice(cursorPos);
        if (value === undefined) {
            this.textarea.value = `${textBeforeCursor.slice(0, -1)}${textAfterCursor}`;
            this.textarea.selectionEnd = cursorPos - 1;
        } else {
            this.textarea.value = textBeforeCursor + value + textAfterCursor;
            this.textarea.selectionEnd = cursorPos + 1;
        }

    },

    // - // - //
    handleShift(keyLayout) {
        document.querySelectorAll('.keyboard__key').forEach((el, ind) => {
            let index = this.properties.shift ? 1 : 0;
            if (typeof keyLayout[this.properties.language][ind] !== 'string') {
                el.innerText = keyLayout[this.properties.language][ind][index];
            } else {
                if (el.innerText.length === 1) {
                    if (this.properties.shift) {
                        if (this.properties.capslock === false) {
                            el.innerText = keyLayout[this.properties.language][ind].toUpperCase();
                        } else {
                            el.innerText = keyLayout[this.properties.language][ind];
                        }
                    } else {
                        if (this.properties.capslock) {
                            el.innerText = keyLayout[this.properties.language][ind].toUpperCase();
                        } else {
                            el.innerText = keyLayout[this.properties.language][ind];
                        }
                    }
                }
            }
        })
    },
    handleCapslock() {
        document.querySelectorAll('.keyboard__key').forEach(el => {
            if (el.innerText.length === 1) {
                if (this.properties.capslock) {
                    if (this.properties.shift === false) {
                        el.innerText = el.innerText.toUpperCase();
                    } else {
                        el.innerText = el.innerText.toLowerCase();
                    }
                } else {
                    if (this.properties.shift) {
                        el.innerText = el.innerText.toUpperCase();
                    } else {
                        el.innerText = el.innerText.toLowerCase();
                    }
                }
            }
        });
    },
    playSounds(name) {
        if (this.properties.volum) {
            let sound = document.querySelector(`audio[data-audio=${name}]`);
            sound.currentTime = 0;
            sound.play();
        }
    },
    speechToText(ev) {
        const transcr = Array.from(ev.results).map(el => el[0]).map(el => el.transcript).join('');
        let cursorPos = this.textarea.selectionStart;
        let textBeforeCursor = this.textarea.value.slice(0, cursorPos);
        let textAfterCursor = this.textarea.value.slice(cursorPos);

        if (ev.results[0].isFinal) {
            this.textarea.value = textBeforeCursor + `${transcr} ` + textAfterCursor;
            this.textarea.selectionStart = this.textarea.selectionEnd = cursorPos + `${transcr} `.length;
        }

    },
    runRecognition() {
        let recognition = this.properties.recognition;
        recognition.interimResults = true;
        recognition.lang = this.properties.language === 'en' ? 'en-US' : 'ru-RU';
        recognition.addEventListener('result', this.speechToText);
        recognition.addEventListener('end', recognition.start);
        recognition.start();

    },
    stopRecognition() {
        let recognition = this.properties.recognition;
        recognition.removeEventListener('result', this.speechToText);
        recognition.removeEventListener('end', recognition.start);
        recognition.stop();
        this.properties.recognition = '';
    },
    _createKeys() {
        let fragment = document.createDocumentFragment();
        const keyLayout = {
            en: [
                ['1', '!'],
                ['2', '@'],
                ['3', '#'],
                ['4', '$'],
                ['5', "%"],
                ['6', '^'],
                ['7', '&'],
                ['8', '*'],
                ['9', "("],
                ['0', ')'],
                'backspace', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ['[', '{'],
                [']', '}'], 'shift',
                'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', [';', ':'],
                ['\'', '"'], 'enter',
                'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', [',', '<'],
                ['.', '>'],
                ['/', '?'], 'lang', 'space', 'left', 'right', 'volum', 'voice'
            ],
            ru: [
                ['1', '!'],
                ['2', '"'],
                ['3', '№'],
                ['4', ';'],
                ['5', "%"],
                ['6', ':'],
                ['7', '?'],
                ['8', '*'],
                ['9', "("],
                ['0', ')'],
                'backspace', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'shift',
                'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
                'done', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б',
                'ю', ['.', ','], 'lang', 'space', 'left', 'right', 'volum', 'voice'
            ]

        };



        keyLayout.en.forEach(el => {
            const lineBreack = ['backspace', 'shift', 'enter'].indexOf(el) !== -1 || el.includes('/');
            let key = document.createElement('button');
            key.classList.add('keyboard__key');
            if (typeof el !== 'string') {
                key.textContent = el[0];
            } else key.textContent = el;

            switch (el) {
                case 'backspace':
                    key.classList.add('keyboard__key--wide');
                    key.innerHTML = this.createButtonIcon('backspace');
                    key.onclick = () => {
                        if (this.textarea.selectionStart === 0) return;
                        this.handleInput();
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds('backspace');
                    }
                    break;
                case 'caps':
                    key.classList.add('keyboard__key--wide', 'keyboard__key-activatable');
                    key.innerHTML = this.createButtonIcon('keyboard_capslock');
                    key.onclick = () => {
                        this.properties.capslock = !this.properties.capslock;
                        key.classList.toggle('keyboard__key-active');
                        this.handleCapslock();
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds('capslock');

                    }
                    break;
                case 'enter':
                    key.classList.add('keyboard__key--wide');
                    key.innerHTML = this.createButtonIcon('keyboard_return');
                    key.onclick = () => {
                        this.handleInput('\n');
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds('enter');

                    }
                    break;
                case 'shift':
                    key.classList.add('keyboard__key-activatable');
                    key.innerHTML = this.createButtonIcon('keyboard_arrow_up');
                    key.onclick = () => {
                        this.properties.shift = !this.properties.shift;
                        key.classList.toggle('keyboard__key-active');
                        this.handleShift(keyLayout);
                        this.illuminateKey(key);
                        this.playSounds('shift');
                    }
                    break;
                case 'done':
                    key.classList.add('keyboard__key--wide', 'keyboard__key-dark');
                    key.innerHTML = this.createButtonIcon('check_circle');
                    key.onclick = () => {
                        this.close();
                    }
                    break;
                case 'lang':
                    key.classList.add('keyboard__key--change-lang');
                    key.innerHTML = this.createButtonIcon('language') + this.properties.language.toUpperCase();
                    key.onclick = () => {
                        this.properties.language === 'ru' ? this.properties.language = 'en' :
                            this.properties.language = 'ru';
                        key.innerHTML = this.createButtonIcon('language') + this.properties.language.toUpperCase();
                        this.handleShift(keyLayout);
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds('lang');

                        if (this.properties.voice) {
                            let recognition = this.properties.recognition;
                            recognition.lang = this.properties.language === 'en' ? 'en-US' : 'ru-RU';
                            recognition.stop();
                        }
                    }
                    break;
                case 'space':
                    key.classList.add('keyboard__key--wide', 'keyboard__key--extra-wide')
                    key.innerHTML = this.createButtonIcon('space_bar');
                    key.onclick = () => {
                        this.handleInput(' ');
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds(this.properties.language);
                    }
                    break;
                case 'left':
                    key.innerHTML = this.createButtonIcon('keyboard_arrow_left');
                    key.onclick = () => {
                        if (this.textarea.selectionEnd !== 0) {
                            this.textarea.selectionEnd--;
                        };
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds(this.properties.language);
                    }
                    break;
                case 'right':
                    key.innerHTML = this.createButtonIcon('keyboard_arrow_right');
                    key.onclick = () => {
                        this.textarea.selectionStart++;
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds(this.properties.language);
                    }
                    break;
                case 'volum':
                    key.innerHTML = this.createButtonIcon('volume_up');
                    key.onclick = () => {
                        this.properties.volum = !this.properties.volum;
                        if (this.properties.volum) {
                            key.innerHTML = this.createButtonIcon('volume_up');
                        } else key.innerHTML = this.createButtonIcon('volume_off');
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds(this.properties.language);
                    }
                    break;
                case 'voice':
                    key.innerHTML = this.createButtonIcon('mic_off');



                    key.onclick = () => {
                        this.properties.voice = !this.properties.voice;
                        if (this.properties.voice) {
                            key.innerHTML = this.createButtonIcon('mic');
                            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                            this.properties.recognition = new SpeechRecognition();
                            this.runRecognition();

                        } else {
                            this.stopRecognition();
                            key.innerHTML = this.createButtonIcon('mic_off');
                        }

                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds(this.properties.language);

                    }
                    break;

                default:
                    key.onclick = (event) => {
                        this.handleInput(event.target.innerText);
                        this.displayCursor();
                        this.illuminateKey(key);
                        this.playSounds(this.properties.language);

                    }
                    break;
            }

            fragment.append(key);
            if (lineBreack) {

                key.insertAdjacentHTML("afterend", '<br>');
            }

        })
        this.elements.keysContainer.appendChild(fragment)
    },
    createAudioTegs() {
        let sounds = ['backspace', 'capslock', 'enter', 'en', 'ru', 'lang', 'shift'];
        sounds.forEach(el => {
            let audio = document.createElement('audio');
            audio.dataset.audio = el;
            audio.src = `sounds/${el}.mp3`;
            this.elements.main.appendChild(audio);
        })
    }

};

document.addEventListener('DOMContentLoaded', () => {
    keyboard.init();

});

document.addEventListener('keydown', function(event) {
    event.preventDefault();
    document.querySelectorAll('.keyboard__key').forEach((el, index, arr) => {
        switch (event.key) {
            case 'Backspace':
                if (el.firstChild.textContent === 'backspace') {
                    el.click();
                };
                break;
            case 'Shift':
                if (el.firstChild.textContent === 'keyboard_arrow_up') {
                    el.click();
                };
                break;
            case 'CapsLock':
                if (el.firstChild.textContent === 'keyboard_capslock') {
                    el.click();
                };
                break;
            case 'Enter':
                if (el.firstChild.textContent === 'keyboard_return') {
                    el.click();
                };
                break;
            case ' ':
                if (el.firstChild.textContent === 'space_bar') {
                    el.click();
                };
                break;
            case 'ArrowLeft':
                if (el.firstChild.textContent === 'keyboard_arrow_left') {
                    el.click();
                };
                break;
            case 'ArrowRight':
                if (el.firstChild.textContent === 'keyboard_arrow_right') {
                    el.click();

                };
                break;
            default:
                let position = keyboard.elements.keysCode.indexOf(event.code);
                if (position === index) {
                    el.click();
                }
                break;

        }


    })
});