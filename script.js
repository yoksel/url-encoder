(function () {
  'use strict';

  var doc = document;

  var initTextarea = doc.querySelector('#init');
  var resultTextarea = doc.querySelector('#result');
  var resultCssTextarea = doc.querySelector('#result-css');
  var resultDemo = doc.querySelector('#demo');
  var demoWrapper = doc.querySelector('.demo-wrapper');
  var contrastButtons = doc.querySelectorAll('.contrast-button');
  var contrastButtonCurrent = null;
  var backgroundColor = '';

  var expanders = doc.querySelectorAll('.expander');
  var expandedClass = 'expanded';
  var symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

  var quotesInputs = document.querySelectorAll('.options__input');
  var externalQuotesValue = document.querySelector('.options__input:checked').value;
  var quotes = getQuotes();

  var buttonExample = document.querySelector('.button-example');

  // Textarea Actions
  // ----------------------------------------

  initTextarea.onchange = function() {
    resultTextarea.value = encodeSVG(initTextarea.value);
  };

  initTextarea.onkeyup = function() {
    getResults();
  };

  function getResults() {
    if (!initTextarea.value) {
      return;
    }

    var namespaced = addNameSpace(initTextarea.value);
    var escaped = encodeSVG(namespaced);

    resultTextarea.value = escaped;
    var resultCss = 'background-image: url(' + quotes.level1 + 'data:image/svg+xml,' + escaped + quotes.level1 + ');';

    resultCssTextarea.value = resultCss;
    resultDemo.setAttribute('style', resultCss);
  }

  // Tabs Actions
  // ----------------------------------------

  for (var i = 0; i < expanders.length; i++) {
    var expander = expanders[i];

    expander.onclick = function() {
      var parent = this.parentNode;
      var expanded = parent.querySelector('.' + expandedClass);

      expanded.classList.toggle('hidden');
      this.classList.toggle('opened');
    };
  }

  // Switch quotes
  // ----------------------------------------

  quotesInputs.forEach(function(input) {
    input.addEventListener('input', function () {
      externalQuotesValue = this.value;
      quotes = getQuotes();
      getResults();
    });
  });

  // Set example
  // ----------------------------------------

  buttonExample.addEventListener('click', function () {
    initTextarea.value = '<svg>\n  <circle r="50" cx="50" cy="50" fill="tomato"/>\n  <circle r="41" cx="47" cy="50" fill="orange"/>\n  <circle r="33" cx="48" cy="53" fill="gold"/>\n  <circle r="25" cx="49" cy="51" fill="yellowgreen"/>\n  <circle r="17" cx="52" cy="50" fill="lightseagreen"/>\n  <circle r="9" cx="55" cy="48" fill="teal"/>\n</svg>';
    getResults();
  });

  // Demo Background Switch
  // ----------------------------------------

  function contrastButtonsSetCurrent(button) {
    var classCurrent = 'contrast-button--current';

    if (contrastButtonCurrent) {
      contrastButtonCurrent.classList.remove(classCurrent);
    }

    backgroundColor = button.dataset.color;
    contrastButtonCurrent = button;
    button.classList.add(classCurrent);
  }

  contrastButtons.forEach(function(button) {
    if (!backgroundColor) {
      contrastButtonsSetCurrent(button);
    }

    button.addEventListener('click', function () {
      contrastButtonsSetCurrent(this);
      demoWrapper.style.background = backgroundColor;
    });
  });

  // Namespace
  // ----------------------------------------

  function addNameSpace(data) {
    if (data.indexOf('http://www.w3.org/2000/svg') < 0) {
      data = data.replace(/<svg/g, '<svg xmlns=' + quotes.level2 + 'http://www.w3.org/2000/svg' + quotes.level2);
    }

    return data;
  }

  // Encoding
  // ----------------------------------------

  function encodeSVG(data) {
    // Use single quotes instead of double to avoid encoding.
    if (externalQuotesValue === 'double') {
      data = data.replace(/"/g, '\'');
    } else {
      data = data.replace(/'/g, '"');
    }

    data = data.replace(/>\s{1,}</g, '><');
    data = data.replace(/\s{2,}/g, ' ');

    return data.replace(symbols, encodeURIComponent);
  }

  // Get quotes for levels
  // ----------------------------------------

  function getQuotes() {
    var double = '"';
    var single = '\'';

    return {
      level1: externalQuotesValue === 'double' ? double : single,
      level2: externalQuotesValue === 'double' ? single : double
    };
  }

})();
