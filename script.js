
const result = document.getElementById("result");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let current = "0";
let stored = null;
let operator = null;
let resetNext = false;

function updateDisplay() {
    result.value = current;
}

function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
            if (b === 0) throw new Error("Cannot divide by zero");
            return a / b;
        default: return b;
    }
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        throw new Error("Invalid result");
    }

    return String(Number(number.toPrecision(12)));
}

function enterDigit(digit) {
    if (resetNext || current === "Error") {
        current = digit;
        resetNext = false;
    } else if (current === "0") {
        current = digit;
    } else if (current.length < 15) {
        current += digit;
    }

    updateDisplay();
}

function chooseOperator(nextOperator) {
    try {
        const value = Number(current);

        if (operator !== null && stored !== null && !resetNext) {
            current = formatNumber(
                calculate(stored, value, operator)
            );
        }

        stored = Number(current);
        operator = nextOperator;
        resetNext = true;

        previous.textContent = `${current} ${nextOperator}`;
        updateDisplay();
    } catch (error) {
        showError(error.message);
    }
}

function showError(message) {
    current = "Error";
    previous.textContent = message;
    stored = null;
    operator = null;
    resetNext = true;
    updateDisplay();
}

function equals() {
    if (operator === null || stored === null) return;

    try {
        const first = stored;
        const second = Number(current);
        const answer = calculate(first, second, operator);

        previous.textContent =
            `${first} ${operator} ${second} =`;

        current = formatNumber(answer);
        stored = null;
        operator = null;
        resetNext = true;
        updateDisplay();
    } catch (error) {
        showError(error.message);
    }
}

function clearCalculator() {
    current = "0";
    stored = null;
    operator = null;
    resetNext = false;
    previous.textContent = "";
    updateDisplay();
}

function deleteDigit() {
    if (resetNext || current === "Error") {
        current = "0";
        resetNext = false;
    } else {
        current = current.length > 1
            ? current.slice(0, -1)
            : "0";

        if (current === "-") current = "0";
    }

    updateDisplay();
}

function addDecimal() {
    if (resetNext || current === "Error") {
        current = "0.";
        resetNext = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}

function toggleSign() {
    if (current === "0" || current === "Error") return;

    current = current.startsWith("-")
        ? current.slice(1)
        : "-" + current;

    updateDisplay();
}

function percentage() {
    if (current === "Error") return;

    current = formatNumber(Number(current) / 100);
    resetNext = true;
    updateDisplay();
}

buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.value !== undefined) {
        const value = button.dataset.value;

        if (/^\d$/.test(value)) {
            enterDigit(value);
        } else {
            chooseOperator(value);
        }

        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteDigit();
            break;
        case "decimal":
            addDecimal();
            break;
        case "sign":
            toggleSign();
            break;
        case "percent":
            percentage();
            break;
        case "equals":
            equals();
            break;
    }
});

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (/^\d$/.test(key)) {
        enterDigit(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        equals();
    } else if (key === ".") {
        addDecimal();
    } else if (key === "Backspace") {
        deleteDigit();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        percentage();
    }
});
