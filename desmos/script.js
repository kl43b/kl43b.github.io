'use strict';
// 2019-10-30 Added rudimentary refresh/back loads a rescue variable because Python uses same key sequence to RUN
var gebi = document.getElementById.bind(document);
var elDebug, elPreload, elRescue;
var calculator;

function ss() {
  var ss=calculator.screenshot({width:200, height:200});
  elDebug.value = ss;
}

function clearCalc() {
  if(confirm("Wipe all formulae?") === true) {
    calculator.setBlank({
      'allowUndo':true
    });
  }
}

function clearDebug() {
  elDebug.value = "";
}

function doTheSet(txt) {
  var obj;
  try { obj = JSON.parse(txt); } catch {alert("Invalid JSON"); return false;}

  calculator.setState(obj, {
    'allowUndo':true, 
	'remapColors':false
  }); 
}

function doPreload() {
  doTheSet(elPreload.innerHTML.trim());
}

function doRescue() {
  if(elRescue.value != "") doTheSet(elRescue.value);
}

function setState() {
  var txt = elDebug.value;
  if(txt.trim() === "") {
    alert("nothing to load");
	return false;
  }
  if(confirm("Wipe ALL formulae then\ntry to load JSON text?") === true)
    doTheSet(txt);
}

// rescue in case of refresh
function getState(rescue) {
  var gs=calculator.getState();
  if(rescue===1) elRescue.value = JSON.stringify(gs);
  else elDebug.value = JSON.stringify(gs);
}

var timeoutCount = 0;
function okTryNow() {
  if(loaded===false) { 
	if(timeoutCount < 9) {
	  timeoutCount += 1;
	  setTimeout(okTryNow, 250); 
	} else alert("Timeout waiting for script to load");
	return false; 
  }
  
  var elt = gebi('calculator'); 
  calculator = Desmos.GraphingCalculator(elt); 
  /*var obj = Desmos;
  for(var i in obj) {
    document.write(i + ": " + obj[i] + "</br>");
  }
  return false;*/
  if(local===true) alert("using local API\n" + Desmos.commit + "\n...which may be out of date");

  elDebug = gebi("debug");
  elPreload = gebi("preload");
  elRescue = gebi("rescue");
  doPreload(); // function, in case we want a reset button
  doRescue();
  
  /* // only works for expressions, not txt, etc so using preload is better
  calculator.setExpressions([ ...
    {"id":"graph1","type":"expression","latex":"f(x)=\\frac{1}{10}x^2+1","color":"#6042a6"},
    {"id":"7","type":"expression","latex":"\\int_a^bf\\left(t\\right)dt","color":"#fa7e19"},
  */
}

window.onload=function(){
  setTimeout(okTryNow, 250);
}

window.onbeforeunload=function(){
  //var oldText = elDebug.value;
  getState(1); // rescue
  //elDebug.value = "LAST CALC BELOW:\n" + elDebug.value + 
  //"\n------------pane value before refresh below-----\n"+oldText;
  return 'Are you sure?';
}