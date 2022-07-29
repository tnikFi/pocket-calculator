const MAX_INPUT_LENGTH = 11;
const MAX_OUTPUT_LENGTH = 21;
const OUTPUT_LENGTH_ERR = "ERROR"
const DEFAULT_VALUE = 0;

const buttons = document.querySelectorAll(".button");
const memoryRow = document.querySelector(".top-row");
const inputRow = document.querySelector(".input-row");

let memory = {
    value: 0,
    action: null,
};

function setOutput(value) {
    if (!value) {
        memoryRow.innerText = DEFAULT_VALUE;
        return;
    } else if (value.length > MAX_OUTPUT_LENGTH) {
        memoryRow.innerText = OUTPUT_LENGTH_ERR;
        return;
    }
    memoryRow.innerText = value;
}

function addNumber(number) {
    if (number == 0 && inputRow.innerText == "0") return;
    if (inputRow.innerText.length >= MAX_INPUT_LENGTH) return;
    if (inputRow.innerText == "0" || inputRow.innerText == "-0") {
        inputRow.innerText = inputRow.innerText.slice(0, -1) + number;
    } else {
        inputRow.innerText += number;
    }
}

function addDecimal() {
    if (inputRow.innerText.includes(".") || inputRow.innerText.length >= MAX_INPUT_LENGTH-1) return;
    inputRow.innerText += "."
}

function changeSign() {
    if (inputRow.innerText.length >= MAX_INPUT_LENGTH) return;
    if (inputRow.innerText.includes("-")) {
        inputRow.innerText = inputRow.innerText.substring(1);
    } else {
        inputRow.innerText = "-" + inputRow.innerText;
    }
}

function handleAction(e) {
    let symbol = e.target.getAttribute("data-symbol");
    switch (symbol) {
        case "ce":
            inputRow.innerText = DEFAULT_VALUE;
            break;
        case "c":
            inputRow.innerText = DEFAULT_VALUE;
            setOutput();
            memory.value = DEFAULT_VALUE;
            memory.action = null;
            break;
        case "del":
            if (inputRow.innerText == "0" || inputRow.innerText.length == 0) break;
            if (inputRow.innerText == "-0") {
                inputRow.innerText = "0";
            } else if (inputRow.innerText.length == 1) {
                inputRow.innerText = DEFAULT_VALUE;
            } else {
                inputRow.innerText = inputRow.innerText.slice(0, -1);
            }
            break;
        case ".":
            addDecimal();
            break;
        case "sgn":
            changeSign();
            break;
        default:
            break;
    }
}

function buttonClick(e) {
    if (e.target.getAttribute("data-type") == "number") {
        addNumber(parseInt(e.target.getAttribute("data-symbol")));
    } else {
        handleAction(e);
    }
}

buttons.forEach(button => button.addEventListener("click", buttonClick));