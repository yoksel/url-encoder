var doc = document;

var initTar = doc.querySelector("#init");
var resTar = doc.querySelector("#result");
var resCssTar = doc.querySelector("#result-css");
var resDemo = doc.querySelector("#demo");

initTar.onchange = function() {
    resTar.value = escape(initTar.value);
};

initTar.onkeyup = function() {
    var escaped = escape(initTar.value);
    resTar.value = escaped;
    var resultCss = 'background-image: url(data:image/svg+xml,' + escaped + ')';
    resCssTar.value = resultCss;
    resDemo.setAttribute("style", resultCss);

    console.log(resDemo);
};

function out(data) {
    console.log(data);
}