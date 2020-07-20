const doc = document;

const initTextarea = doc.querySelector(`#init`);
const resultTextarea = doc.querySelector(`#result`);
const resultCssTextarea = doc.querySelector(`#result-css`);
const resultDemo = doc.querySelector(`#demo`);
const demoWrapper = doc.querySelector(`.demo-wrapper`);
const contrastButtons = doc.querySelectorAll(`.contrast-button`);
let contrastButtonCurrent = null;
let backgroundColor = ``;

const expanders = doc.querySelectorAll(`.expander`);
const expandedClass = `expanded`;
const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;

const quotesInputs = document.querySelectorAll(`.options__input`);
let externalQuotesValue = document.querySelector(`.options__input:checked`).value;
let quotes = getQuotes();

const buttonExample = document.querySelector(`.button-example`);

// Textarea Actions
// ----------------------------------------

initTextarea.oninput = function () {
  getResults();
};

resultTextarea.oninput = function () {
  const value = resultTextarea.value.trim()
    .replace(/background-image:\s{0,}url\(/, ``)
    .replace(/["']{0,}data:image\/svg\+xml,/, ``)
    .replace(/["']\);{0,}$/, ``);
  initTextarea.value = decodeURIComponent(value);
  getResults();
};

function getResults () {
  if (!initTextarea.value) {
    resultCssTextarea.value = ``;
    resultDemo.setAttribute(`style`, ``);
    return;
  }

  const namespaced = addNameSpace(initTextarea.value);
  const escaped = encodeSVG(namespaced);
  resultTextarea.value = escaped;
  const resultCss = `background-image: url(${quotes.level1}data:image/svg+xml,${escaped}${quotes.level1});`;
  resultCssTextarea.value = resultCss;
  resultDemo.setAttribute(`style`, resultCss);
}

// Tabs Actions
// ----------------------------------------

for (let i = 0; i < expanders.length; i++) {
  const expander = expanders[i];

  expander.onclick = function () {
    const parent = this.parentNode;
    const expanded = parent.querySelector(`.` + expandedClass);
    expanded.classList.toggle(`hidden`);
    this.classList.toggle(`opened`);
  };
}

// Switch quotes
// ----------------------------------------

quotesInputs.forEach(input => {
  input.addEventListener(`input`, function () {
    externalQuotesValue = this.value;
    quotes = getQuotes();
    getResults();
  });
});

// Set example
// ----------------------------------------

buttonExample.addEventListener(`click`, () => {
  initTextarea.value = `<svg>
  <circle r="50" cx="50" cy="50" fill="tomato"/>
  <circle r="41" cx="47" cy="50" fill="orange"/>
  <circle r="33" cx="48" cy="53" fill="gold"/>
  <circle r="25" cx="49" cy="51" fill="yellowgreen"/>
  <circle r="17" cx="52" cy="50" fill="lightseagreen"/>
  <circle r="9" cx="55" cy="48" fill="teal"/>
</svg>`;
  getResults();
});

// Demo Background Switch
// ----------------------------------------

function contrastButtonsSetCurrent (button) {
  const classCurrent = `contrast-button--current`;

  if (contrastButtonCurrent) {
    contrastButtonCurrent.classList.remove(classCurrent);
  }

  backgroundColor = button.dataset.color;
  contrastButtonCurrent = button;
  button.classList.add(classCurrent);
}

contrastButtons.forEach(button => {
  if (!backgroundColor) {
    contrastButtonsSetCurrent(button);
  }

  button.addEventListener(`click`, function () {
    contrastButtonsSetCurrent(this);
    demoWrapper.style.background = backgroundColor;
  });
});

// Namespace
// ----------------------------------------

function addNameSpace (data) {
  if (data.indexOf(`http://www.w3.org/2000/svg`) < 0) {
    data = data.replace(/<svg/g, `<svg xmlns=${quotes.level2}http://www.w3.org/2000/svg${quotes.level2}`);
  }

  return data;
}

// Encoding
// ----------------------------------------

function encodeSVG (data) {
  // Use single quotes instead of double to avoid encoding.
  if (externalQuotesValue === `double`) {
    data = data.replace(/"/g, `'`);
  } else {
    data = data.replace(/'/g, `"`);
  }

  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);

  // Using encodeURIComponent() as replacement function
  // allows to keep result code readable
  return data.replace(symbols, encodeURIComponent);
}

// Get quotes for levels
// ----------------------------------------

function getQuotes () {
  const double = `"`;
  const single = `'`;

  return {
    level1: externalQuotesValue === `double` ? double : single,
    level2: externalQuotesValue === `double` ? single : double
  };
}

// Copy to clipboard
// ----------------------------------------

const copyResultButton = document.getElementById(`copy-result-button`);
const copyCSSResultButton = document.getElementById(`copy-css-result-button`);

copyResultButton.addEventListener(`click`, function (event) {
  const textToCopy = document.getElementById(`result`);
  textToCopy.select();
  document.execCommand(`copy`);
});

copyCSSResultButton.addEventListener(`click`, function (event) {
  const textToCopy = document.getElementById(`result-css`);
  textToCopy.select();
  document.execCommand(`copy`);
});

// Common
// ----------------------------------------

// eslint-disable-next-line no-unused-vars
function out (data) {
  console.log(data);
}
