// DESKTOP
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
// left: 37, up: 38, right: 39, down: 40,
// (Source: http://stackoverflow.com/a/4770179)
/*
var keys = [32,33,34,35,36,37,38,39,40];

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function keydown(e) {
    for (var i = keys.length; i--;) {
        if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
        }
    }
}

function wheel(e) {
  preventDefault(e);
}

function disableScroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
  disableScrollMobile();
}

function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;
  	enableScrollMobile();
}

// MOBILE
function disableScrollMobile(){
  document.addEventListener('touchmove',preventDefault, false);
}
function enableScrollMobile(){
  document.removeEventListener('touchmove',preventDefault, false);
}
*/

function ShuffleArray(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function between(x, min, max){
	return x >= min && x < max;
}

function rangeResult(x, x1, x2, y1, y2){
	var y = (y2 - y1)/(x2 - x1)*(x - x1) + y1;
	var result;
	if(x < x1){
		result = y1;
	}
	else if(x > x2){
		result = y2;
	}
	else{
		result = y;
	}
	return result;
}
