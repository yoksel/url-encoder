var doc = document;

var initTar = doc.querySelector("#init");
var resTar = doc.querySelector("#result");
var resCssTar = doc.querySelector("#result-css");
var resDemo = doc.querySelector("#demo");

var expanders = doc.querySelectorAll(".expander");
var expandedClass = "expanded";

// Textarea Actions
//----------------------------------------

initTar.onchange = function() {
    resTar.value = escape(initTar.value);
};

initTar.onkeyup = function() {
    var escaped = escape(initTar.value);
    resTar.value = escaped;
    var resultCss = 'background-image: url(data:image/svg+xml,' + escaped + ')';
    resCssTar.value = resultCss;
    resDemo.setAttribute("style", resultCss);
};

// Tabs Actions
//----------------------------------------

for (var i = 0; i < expanders.length; i++) {
    var expander = expanders[i];

    expander.onclick = function() {
        var parent = this.parentNode;
        var expanded = parent.querySelector("." + expandedClass);
        expanded.classList.toggle("hidden");
        this.classList.toggle("opened");
    };
}

// Common
//----------------------------------------

function out(data) {
    console.log(data);
}