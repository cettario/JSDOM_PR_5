const form = document.getElementById('cardForm');
const bank = document.getElementById('bank');
const system = document.getElementById('system');
const number = document.getElementById('number');
const holder = document.getElementById('holder');
const month = document.getElementById('month');
const year = document.getElementById('year');
const error = document.getElementById('error');
const table = document.getElementById('cardTable');

const bankLogo = document.getElementById('bankLogo');
const systemLogo = document.getElementById('systemLogo');
const cardNumber = document.getElementById('cardNumber');
const cardHolder = document.getElementById('cardHolder');
const cardExpiry = document.getElementById('cardExpiry');

for (let i = 1; i <= 12; i++) {
  const option = document.createElement('option');
  option.value = String(i).padStart(2, '0');
  option.textContent = option.value;
  month.append(option);
}

const currentYear = new Date().getFullYear();
for (let i = currentYear; i <= currentYear + 12; i++) {
  const option = document.createElement('option');
  option.value = String(i);
  option.textContent = String(i);
  year.append(option);
}

function setLogo(container, className, content) {
  container.replaceChildren();
  if (!className) return;
  const element = document.createElement('span');
  element.className = className;
  if (Array.isArray(content)) {
    for (const item of content) element.append(document.createElement(item));
  } else {
    element.textContent = content;
  }
  container.append(element);
}

function updatePreview() {
  const banks = {
    'Сбербанк': ['logo-sber', '✓'],
    'Т-Банк': ['logo-tbank', 'Т'],
    'Альфа-Банк': ['logo-alfa', 'А']
  };
  const systems = {
    'МИР': ['logo-mir', 'МИР'],
    'Visa': ['logo-visa', 'VISA'],
    'Mastercard': ['logo-mastercard', ['span', 'span']]
  };
  setLogo(bankLogo, ...(banks[bank.value] || ['', '']));
  setLogo(systemLogo, ...(systems[system.value] || ['', '']));
  cardNumber.textContent = number.value || '0000 0000 0000 0000';
  cardHolder.textContent = holder.value.trim() || 'ИМЯ ФАМИЛИЯ';
  const shortYear = year.value ? year.value.slice(-2) : 'ГГ';
  cardExpiry.textContent = `${month.value || 'ММ'}/${shortYear}`;
}

number.addEventListener('input', () => {
  const digits = number.value.replace(/\D/g, '').slice(0, 16);
  number.value = digits.replace(/(.{4})(?=.)/g, '$1 ');
  updatePreview();
});

holder.addEventListener('input', () => {
  holder.value = holder.value.toUpperCase();
  updatePreview();
});

for (const field of [bank, system, month, year]) {
  field.addEventListener('change', updatePreview);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  error.hidden = true;
  const digits = number.value.replace(/\D/g, '');
  if (digits.length !== 16) {
    error.textContent = 'Номер карты должен содержать 16 цифр.';
    error.hidden = false;
    return;
  }
  if (!holder.value.trim()) {
    error.textContent = 'Укажите имя держателя.';
    error.hidden = false;
    return;
  }
  const expiry = new Date(Number(year.value), Number(month.value) - 1, 1);
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  if (expiry < thisMonth) {
    error.textContent = 'Срок действия карты уже истёк.';
    error.hidden = false;
    return;
  }
  const row = document.createElement('tr');
  const values = [bank.value, system.value, number.value, holder.value.trim(), `${month.value}/${year.value.slice(-2)}`];
  for (const text of values) {
    const cell = document.createElement('td');
    cell.textContent = text;
    row.append(cell);
  }
  table.append(row);
  form.reset();
  updatePreview();
});

updatePreview();
