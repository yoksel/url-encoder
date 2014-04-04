var doc = document;

var initTar = doc.querySelector("#init");
var resTar = doc.querySelector("#result");

initTar.onchange = function(){
   resTar.value = escape(initTar.value);
  }
initTar.onkeyup = function(){
   resTar.value = escape(initTar.value);
  }  

function out( data ){
  console.log(data);
}