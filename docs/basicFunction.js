var RANGE_LOCK = Object.freeze({
	NONE: 1,
	START: 2,
	END: 3,
	BOTH: 4
});

function ShuffleArray(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function between(x, min, max){
	return x >= min && x < max;
}

function rangeResult(x, x1, x2, y1, y2, lock){
	var y = (y2 - y1)/(x2 - x1)*(x - x1) + y1;
	var result;
	switch(lock){
		case RANGE_LOCK.NONE:
			if(x >= x1 && x < x2){
				result = y;
				return result;
			}
			break;
		case RANGE_LOCK.START:
			if(x < x1){
				result = y1;
				return result;
			}
			else if(x < x2){
				result = y;
				return result;
			}
			else{
				//do nothing
			}
			break;
		case RANGE_LOCK.END:
			if(x > x2){
				result = y2;
				return result;
			}
			else if(x >= x1){
				result = y;
				return result;
			}
			else{
				//donothing
			}
			break;
		case RANGE_LOCK.BOTH:
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
			break;
	}
}

function radialToCartesian(target, reference, container, ratioR, deg, doit){
	var r = Math.min($(reference).width(), $(reference).height())/2;
	var centerX = $(container).width()/2;
	var centerY = $(container).height()/2;
	var degPi = deg / 180 * Math.PI;
	if(doit){
		$(target).css({
			'left': centerX + r * ratioR * Math.cos(degPi),
			'top': centerY + r * ratioR * Math.sin(degPi) * (-1)
		});
	}
	var obj = {
		x: centerX + r * ratioR * Math.cos(degPi),
		y: centerY + r * ratioR * Math.sin(degPi) * (-1)
	}
	return obj;
	/*
	var obj ={
		x = centerX + r * ratioR * Math.cos(degPi),
		y = centerY + r * ratioR * Math.sin(degPi)
	}
	return obj;
	*/
}
