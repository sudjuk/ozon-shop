console.log("Скрипт загружен");

window.onload = function () {
    let currentInput = '0';
    let previousInput = null;
    let selectedOperation = null;
    let shouldResetInput = false;

    const outputElement = document.getElementById("result");
    const clearBackspaceButton = document.getElementById("btn_op_backspace");
    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

    function updateDisplay() {
        const maxLength = 10;
        const minFontSize = 1.2;
        const defaultFontSize = 2;
        const maxNumber = 999999999999999999999999;
        
        if (parseFloat(currentInput) > maxNumber) {
            currentInput = maxNumber.toString();
        }
    
        outputElement.innerHTML = currentInput;
    
        let fontSize = defaultFontSize;
        if (currentInput.length > maxLength) {
            fontSize -= 0.4;
        }
        if (currentInput.length > maxLength + 4) {
            fontSize -= 0.4;
        }
    
        outputElement.style.fontSize = `${Math.max(fontSize, minFontSize)}rem`;
    
        updateClearButton();
    }
    
    

    function updateClearButton() {
        if (clearBackspaceButton) {
            clearBackspaceButton.innerHTML = (currentInput === '0' || shouldResetInput) ? 'C' : '←';
        }
    }

    function clearAll() {
        currentInput = '0';
        previousInput = null;
        selectedOperation = null;
        shouldResetInput = false;
        updateDisplay();
    }

    function handleBackspace() {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            clearAll();
        }
        updateDisplay();
    }

    function handleDigitInput(digit) {
        if (shouldResetInput) {
            currentInput = digit;
            shouldResetInput = false;
        } else {
            if (digit === '.' && currentInput.includes('.')) return;
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    digitButtons.forEach(button => {
        button.onclick = function () {
            handleDigitInput(button.innerHTML);
        };
    });

    document.getElementById("btn_digit_dot").onclick = function () {
        handleDigitInput(".");
    };
    document.getElementById("btn_op_percent").onclick = () => {
        if (selectedOperation !== null) {
            calculateResult();
        }
        previousInput = currentInput;
        selectedOperation = '%';
        shouldResetInput = true;
    };

    function handleOperation(operation) {
        if (selectedOperation !== null) calculateResult();
        previousInput = currentInput;
        selectedOperation = operation;
        shouldResetInput = true;
    }

    document.getElementById("btn_op_plus").onclick = () => handleOperation('+');
    document.getElementById("btn_op_minus").onclick = () => handleOperation('-');
    document.getElementById("btn_op_mult").onclick = () => handleOperation('*');
    document.getElementById("btn_op_div").onclick = () => handleOperation('/');

    function calculateResult() {
        if (previousInput === null || selectedOperation === null) return;
        const a = parseFloat(previousInput);
        const b = parseFloat(currentInput);
        let calculatedResult;
        switch (selectedOperation) {
            case '+': calculatedResult = a + b; break;
            case '-': calculatedResult = a - b; break;
            case '*': calculatedResult = a * b; break;
            case '/': calculatedResult = b !== 0 ? a / b : 'Error'; break;
            case '%': calculatedResult = a % b; break;
        }
        if (typeof calculatedResult === "number") {
            calculatedResult = Math.round(calculatedResult * 1e10) / 1e10;
        }
        currentInput = calculatedResult.toString();
        previousInput = null;
        selectedOperation = null;
        shouldResetInput = true;
        updateDisplay();
    }

    document.getElementById("btn_op_equal").onclick = function () {
        calculateResult();
        shouldResetInput = true;
        updateDisplay();
    };

    clearBackspaceButton.onclick = function () {
        if (clearBackspaceButton.innerHTML === 'C') {
            clearAll();
        } else {
            handleBackspace();
        }
    };

    document.getElementById("btn_op_sign").onclick = function () {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    };

    function factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return 'Error';
        if (n > 170) return 'Error';
        return n === 0 ? 1 : n * factorial(n - 1);
    }

    function applyFunction(fn) {
        let value = parseFloat(currentInput);
        if (isNaN(value)) return;
    
        switch (fn) {
            case "sin":
                value = Math.sin(value * Math.PI / 180);
                break;
            case "cos":
                value = Math.cos(value * Math.PI / 180);
                break;
            case "tan":
                value = Math.tan(value * Math.PI / 180);
                break;
            case "sqrt":
                value = value >= 0 ? Math.sqrt(value) : 'Error';
                break;
            case "square":
                value = value ** 2;
                break;
            case "factorial":
                value = factorial(value);
                break;
        }
    
        if (Math.abs(value) < 1e-10) value = 0;
    
        currentInput = value.toString().slice(0, 10);
        shouldResetInput = true;
        updateDisplay();
    }
    
    
    

    document.getElementById("btn_extra_sin").onclick = () => applyFunction("sin");
    document.getElementById("btn_extra_cos").onclick = () => applyFunction("cos");
    document.getElementById("btn_extra_tan").onclick = () => applyFunction("tan");
    document.getElementById("btn_extra_sqrt").onclick = () => applyFunction("sqrt");
    document.getElementById("btn_extra_square").onclick = () => applyFunction("square");
    document.getElementById("btn_extra_factorial").onclick = () => applyFunction("factorial");

    updateDisplay();
};

document.getElementById("btn_toggle_extra").onclick = function () {
    document.getElementById("extra-buttons").classList.toggle("hidden");
};

