const MAX_INPUT_LENGTH = 11;
const MAX_OUTPUT_LENGTH = 21;
const OUTPUT_LENGTH_ERR = "ERROR"
const DEFAULT_VALUE = 0;

const buttons = document.querySelectorAll(".button");
const memoryRow = document.querySelector(".top-row");
const inputRow = document.querySelector(".input-row");

const FUNCTIONS = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "×": (a, b) => a * b,
    "÷": (a, b) => a / b
}


const KEY_MAPPINGS = {
    "0": {dataType: "number", symbol: "0"},
    "2": {dataType: "number", symbol: "1"},
    "2": {dataType: "number", symbol: "2"},
    "3": {dataType: "number", symbol: "3"},
    "4": {dataType: "number", symbol: "4"},
    "5": {dataType: "number", symbol: "5"},
    "6": {dataType: "number", symbol: "6"},
    "7": {dataType: "number", symbol: "7"},
    "8": {dataType: "number", symbol: "8"},
    "9": {dataType: "number", symbol: "9"},
    ".": {dataType: "number", symbol: "."},
    "c": {dataType: "action", symbol: "c"},
    "Delete": {dataType: "action", symbol: "ce"},
    "Backspace": {dataType: "action", symbol: "del"},
    "sgn": {dataType: "action", symbol: "sgn"},"1": {dataType: "number", symbol: "1"},
    "+": {dataType: "action", symbol: "+"},
    "-": {dataType: "action", symbol: "-"},
    "*": {dataType: "action", symbol: "×"},
    "/": {dataType: "action", symbol: "÷"},
    "=": {dataType: "action", symbol: "="},
    "Enter": {dataType: "action", symbol: "="},
}

let memory = {
    value: DEFAULT_VALUE,
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

function setInput(value) {
    inputRow.innerText = value ? value : DEFAULT_VALUE;
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
        setInput(inputRow.innerText.substring(1));
    } else {
        setInput("-" + inputRow.innerText);
    }
}

function equals() {
    let input = parseFloat(inputRow.innerText);
    if (!input) return;
    if (!memory.action) {
        memory.value = input;
        setOutput(input);
        setInput();
    } else {
        memory.value = memory.action(memory.value, input);
        memory.action = null;
        setOutput(memory.value);
        setInput();
    }
}

function setAction(key) {
    let func = FUNCTIONS[key];
    if (!func) throw Error("Invalid action");
    if (memory.value) {
        equals()
        memory.action = func;
    } else {
        memory.value = parseFloat(inputRow.innerText);
        setInput();
    }
    memory.action = func;
    setOutput(`${memory.value} ${key}`);
}

function handleAction(symbol) {
    switch (symbol) {
        case "ce":
            setInput();
            break;
        case "c":
            setInput();
            setOutput();
            memory.value = DEFAULT_VALUE;
            memory.action = null;
            break;
        case "del":
            if (inputRow.innerText == "0" || inputRow.innerText.length == 0) break;
            if (inputRow.innerText == "-0") {
                setInput("0");
            } else if (inputRow.innerText.length == 1) {
                setInput();
            } else {
                setInput(inputRow.innerText.slice(0, -1));
            }
            break;
        case ".":
            addDecimal();
            break;
        case "sgn":
            changeSign();
            break;
        case "=":
            equals()
            break;
        default:
            setAction(symbol);
            break;
    }
}

function keyPress(e) {
    let keyMapping = KEY_MAPPINGS[e.key];
    if (!keyMapping) return;
    let button = document.querySelector(`.button[data-symbol=\"${keyMapping.symbol}\"]`);
    if (!button) return;
    // Emulate a click event on the button. Only the target is needed.
    buttonClick({target: button});
}

function buttonClick(e) {
    e.target.classList.add("pressed");
    if (e.target.getAttribute("data-type") == "number") {
        addNumber(parseInt(e.target.getAttribute("data-symbol")));
    } else {
        handleAction(e.target.getAttribute("data-symbol"));
    }
}

function transitionEnd(e) {
    if (!this.classList) return;
    this.classList.remove("pressed");
}

buttons.forEach(button => {
    button.addEventListener("click", buttonClick);
    button.addEventListener("transitionend", transitionEnd);
});

window.addEventListener("keydown", keyPress);