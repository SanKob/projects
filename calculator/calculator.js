class Calculator {
    constructor(previousOperandHtmlText, currentOperandHtmlText) {
        this.previousOperandHtmlText = previousOperandHtmlText;
        this.currentOperandHtmlText = currentOperandHtmlText;
        this.readyToReset = false;
        this.clear();
    }

    clear() {
        this.previousOperand = "";
        this.currentOperand = "";
        this.operation = undefined;
        this.readyToReset = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);

    }

    appendNumber(number) {
        if (number === "." && this.currentOperand == '') {
            return;
        }
        if (number === "^" && this.currentOperand == '') {
            return;
        }
        if (number === "." && this.currentOperand.includes(".")) {
            return;
        }

        if (number === '0' && this.currentOperand === '0') {
            return;
        }
        if (number === '^' && this.currentOperand.includes("^")) {
            return;
        }
        if (number === '-' && this.currentOperand.includes("-")) {
            return this.currentOperand = this.currentOperand.slice(1);
        }
        if (number === '-' && this.currentOperand !== "") {
            return this.currentOperand = number.toString() + this.currentOperand.toString();
        }
        this.currentOperand = this.currentOperand.toString() + number.toString();

    }
    chooseOperation(operation) {
        if (this.currentOperand.toString().includes('^')) {
            this.handlePowOparation();
        }

        if (this.currentOperand.toString().includes(".") && /0+$|\.0+$/.test(this.currentOperand.toString())) {
            this.currentOperand = this.currentOperand.toString().replace(/0+$|\.0+$/, '');
        }

        if (this.currentOperand === "") {
            return;
        }

        if (this.previousOperand !== "") {

            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    update() {
        this.currentOperandHtmlText.innerText = this.currentOperand;
        if (this.operation !== undefined) {
            this.previousOperandHtmlText.innerText = this.previousOperand + this.operation;
        } else {
            this.previousOperandHtmlText.innerText = "";
        }
    }

    compute() {

        if (this.currentOperand.toString().includes('^')) {
            return this.handlePowOparation();
        }
        let result;
        const prev = parseFloat(this.previousOperand);
        const curr = parseFloat(this.currentOperand);


        if (isNaN(prev) || isNaN(curr)) {
            return;
        }
        switch (this.operation) {
            case "+":
                result = prev + curr;
                break;
            case "-":
                result = prev - curr;
                break;
            case "*":
                result = prev * curr;
                break;
            case "÷":
                result = prev / curr;
                break;
            case "√":
                result = Math.sqrt(curr);
                break;
            case "xy":
                result = prev / curr;
                break;
            default:
                return;

        }
        this.previousOperand = "";
        this.operation = undefined;
        this.currentOperand = Math.round((result) * 1000000000000) / 1000000000000;

    }
    handleSqrtOparation() {
        if (this.currentOperand === "") {
            return;
        }
        if (this.currentOperand.includes('-')) {
            return this.currentOperand = 'ошибка';
        }
        let curr = parseFloat(this.currentOperand);
        this.currentOperand = Math.sqrt(curr);

        if (this.previousOperand !== "") {
            this.compute();
        }
    }

    handlePowOparation() {
        let currentOperandToArray = this.currentOperand.split("^");
        let operandFirst = parseFloat(currentOperandToArray[0]);
        let operandSecond = parseFloat(currentOperandToArray[1]);
        this.currentOperand = Math.pow(operandFirst, operandSecond);
        if (this.previousOperand !== "") {

            this.compute();
        }
    }
}

const operandButtons = document.querySelectorAll("[data-operand]");
const numberButtons = document.querySelectorAll("[data-number]");
const clearButton = document.querySelector("[data-clear-all]");
const deleteButton = document.querySelector("[data-delete]");
const equalButton = document.querySelector("[data-equal]");
const previousOperandHtmlText = document.querySelector("[data-previous-operand]");
const currentOperandHtmlText = document.querySelector("[data-current-operand]");
//const operandPowButton  = document.querySelector('[data-operand-pow]');
const operandSqrtButton = document.querySelector('[data-operand-sqrt]');
const minusButton = document.querySelector('[data-minus]');


let calculator = new Calculator(previousOperandHtmlText, currentOperandHtmlText);

numberButtons.forEach((button) => {

    button.addEventListener("click", () => {
        if (calculator.readyToReset && calculator.previousOperand === "" && calculator.currentOperand !== "") {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }

        calculator.appendNumber(button.innerText);
        calculator.update();
    })
})

operandButtons.forEach((button) => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.update();
    })
})

operandSqrtButton.addEventListener('click', () => {
    calculator.readyToReset = true;
    calculator.handleSqrtOparation();
    calculator.update();
})

clearButton.addEventListener("click", () => {
    calculator.clear();
    calculator.update();
})

equalButton.addEventListener("click", () => {
    calculator.readyToReset = true;
    calculator.compute();
    calculator.update();

})
deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.update();
})

minusButton.addEventListener('click', () => {
    calculator.appendNumber('-');
    calculator.update();
})