const amountInput = document.getElementById("amount");
const result = document.getElementById("result");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

fromCurrency.value = "USD";
toCurrency.value = "INR";

amountInput.addEventListener("input", handleInput);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

function handleInput() {
  amountInput.value = amountInput.value.replace(/[^0-9.]/g, "");
  convertCurrency();
}

function pressKey(key) {
  if (key === "." && amountInput.value.includes(".")) return;
  amountInput.value += key;
  convertCurrency();
}

function clearInput() {
  amountInput.value = amountInput.value.slice(0, -1);
  convertCurrency();
}

function swapCurrencies() {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
  convertCurrency();
}

async function convertCurrency() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    result.style.display = "none";
    return;
  }

  result.style.display = "block";
  result.innerText = "Converting...";

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
    const data = await res.json();

    const rate = data.rates?.[toCurrency.value];
    if (!rate) throw new Error();

    const converted = (amount * rate).toFixed(2);

    result.innerText = `${amount} ${fromCurrency.value} → ${converted} ${toCurrency.value}`;

    result.classList.add("highlight");
    setTimeout(() => result.classList.remove("highlight"), 300);

  } catch {
    result.innerText = "⚠️ Failed to fetch rates";
  }
}