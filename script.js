var doc = document;

var initTar = doc.querySelector( "#init" );
var resTar = doc.querySelector( "#result" );
var resCssTar = doc.querySelector( "#result-css" );
var resDemo = doc.querySelector( "#demo" );
var demoWrapper = doc.querySelector( ".demo-wrapper" );
var contrastButtons = doc.querySelectorAll( ".contrast-button" );
var contrastButtonCurrent = null;
var backgroundColor = '';

var expanders = doc.querySelectorAll( ".expander" );
var expandedClass = "expanded";
var demoContrastClass = "demo-contrast-on";
var symbols = /[\r\n"%#()<>?\[\\\]^`{|}]/g;

// Textarea Actions
//----------------------------------------

initTar.onchange = function() {
    resTar.value = encodeSVG(initTar.value);
};

initTar.onkeyup = function() {
    var namespaced = addNameSpace( initTar.value );
    var escaped = encodeSVG( namespaced );
    resTar.value = escaped;
    var resultCss = 'background-image: url("data:image/svg+xml,' + escaped + '");';
    resCssTar.value = resultCss;
    resDemo.setAttribute( "style", resultCss );
};

// Tabs Actions
//----------------------------------------

for (var i = 0; i < expanders.length; i++) {
    var expander = expanders[i];

    expander.onclick = function() {
        var parent = this.parentNode;
        var expanded = parent.querySelector( "." + expandedClass );
        expanded.classList.toggle( "hidden" );
        this.classList.toggle( "opened" );
    };
}

// Demo Background Switch
//----------------------------------------

function contrastButtonsSetCurrent(button) {
    const classCurrent = 'contrast-button--current';

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

    button.addEventListener('click', function () {
        contrastButtonsSetCurrent(this);
        demoWrapper.style.background = backgroundColor;
    });
});

// Namespace
//----------------------------------------

function addNameSpace( data ) {
    if ( data.indexOf( "http://www.w3.org/2000/svg" ) < 0 ) {
        data = data.replace( /<svg/g, "<svg xmlns='http://www.w3.org/2000/svg'" );
    }

    return data;
}

// Encoding
//----------------------------------------

function encodeSVG( data ) {
    // Use single quotes instead of double to avoid encoding.
    if ( data.indexOf( '"' ) >= 0 ) {
        data = data.replace( /"/g, "'" );
    }

    data = data.replace( />\s{1,}</g, "><" );
    data = data.replace( /\s{2,}/g, " " );

    return data.replace( symbols, escape );
}

// Common
//----------------------------------------

function out( data ) {
    console.log( data );
}
