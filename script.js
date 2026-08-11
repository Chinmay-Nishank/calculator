const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = '';
let previous = '';
let operator = null;
let waitingForOperand = false;

function updateDisplay(value) {
  display.textContent = value;
  // Shrink font for long numbers
  const len = value.length;
  display.style.fontSize = len > 12 ? '1.6rem' : len > 9 ? '2rem' : '2.8rem';
}

function clear() {
  current = '';
  previous = '';
  operator = null;
  waitingForOperand = false;
  updateDisplay('0');
}

function inputDigit(digit) {
  if (waitingForOperand) {
    current = digit;
    waitingForOperand = false;
  } else {
    // Prevent multiple leading zeros / extra dots
    if (digit === '.' && current.includes('.')) return;
    if (current === '' && digit === '.') current = '0';
    if (current === '0' && digit !== '.') current = digit;
    else current += digit;
  }
  updateDisplay(current);
}

function chooseOperator(nextOperator) {
  const value = parseFloat(current);

  if (operator && !waitingForOperand) {
    const result = calculate(parseFloat(previous), value, operator);
    previous = String(result);
    current = previous;
  } else {
    previous = current;
  }

  operator = nextOperator;
  waitingForOperand = true;
  updateDisplay(current);
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Error' : a / b;
    default: return b;
  }
}

function equals() {
  if (operator === null || waitingForOperand) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  const result = calculate(a, b, operator);

  current = String(result);
  previous = '';
  operator = null;
  waitingForOperand = false;
  updateDisplay(current);
}

function percent() {
  current = String(parseFloat(current) / 100);
  updateDisplay(current);
}

function deleteLast() {
  if (waitingForOperand) return;
  current = current.slice(0, -1);
  if (current === '' || current === '-') current = '0';
  updateDisplay(current);
}

keys.addEventListener('click', (e) => {
  const key = e.target.closest('.key');
  if (!key) return;

  const action = key.dataset.action;
  const value = key.dataset.value;

  switch (action) {
    case 'clear':
      clear();
      break;
    case 'delete':
      deleteLast();
      break;
    case 'percent':
      percent();
      break;
    case 'op':
      chooseOperator(value);
      break;
    case 'equals':
      equals();
      break;
    default:
      inputDigit(value);
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9' || e.key === '.') {
    inputDigit(e.key);
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    chooseOperator(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    equals();
  } else if (e.key === 'Backspace') {
    deleteLast();
  } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
    clear();
  } else if (e.key === '%') {
    percent();
  }
});
