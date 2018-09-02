/********************
 VARIABLE DECLARATION
*********************/
// constants
var LIST_LEFT;
var USER_LANG = navigator.language || navigator.userLanguage;
var ID_SCROLL_PREV = 'box_prev';
var ID_SCROLL_NEXT = 'box_next';
var ID_DAYLIST = 'box-daylist';
var ID_VIEWPORT = 'layer_viewport';
var ID_NEEDLE = 'obj_needle';
var FRAMERATE = 1000/50;
var HOVERSPEED = 20;
var ACC_T_INCREASE = 30;
var ACC_T_ZERO = 20;
var ACC_T_DECREASE = 10;
// control variables
var listSpeed;
var v0 = 0;
var acc = 0;
var acc_t_count = 0;
// object
var daylist = document.createElement('div');
	daylist.id = ID_DAYLIST;
	daylist.classList.add('container-daylist');
var viewport = document.createElement('div');
	viewport.id = ID_VIEWPORT;
	viewport.classList.add('container-viewport');
var dayBox = [];
var stitchBox = [];
var stitch = [];
// decorative objects
var dimLeft = document.createElement('div');
	dimLeft.classList.add('container-left');
var dimRight = document.createElement('div');
	dimRight.classList.add('container-right');
var scrollBoxPrev = document.createElement('div');
	scrollBoxPrev.setAttribute('id', ID_SCROLL_PREV);
	scrollBoxPrev.classList.add('container-scroll-prev');
var scrollBoxNext = document.createElement('div');
	scrollBoxNext.setAttribute('id', ID_SCROLL_NEXT);
	scrollBoxNext.classList.add('container-scroll-next');
var needleBox = document.createElement('div');
	needleBox.classList.add('container-needle');
var needleImage = document.createElement('object');
	needleImage.setAttribute('id', ID_NEEDLE);
	needleImage.setAttribute('data', 'assets/needle.svg');
	needleImage.setAttribute('type', 'image/svg+xml');
	needleImage.classList.add('img-needle');


if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
 alert('mobile browser!');
}



/**************
 READ JSON FILE
***************/
localStorage.clear();
var sheetIndex = ["date", "day", "type", "instensity", "duration", "hue", "saturation", "level", "note", "redundant"];
var tempStr;
var jsonData = [];
var url_parameter = "https://spreadsheets.google.com/pub?key=1IqZWY3edz2fGNT8O3uciprX6oElkLu8Vm8-i33CMNyk&hl=kr&output=html";
var googleSpreadsheet = new GoogleSpreadsheet();
googleSpreadsheet.url(url_parameter);
googleSpreadsheet.load(function(result) {
	for(i = 0; i < result.data.length; i++){
		var x = Math.round((i/sheetIndex.length - Math.trunc(i/sheetIndex.length))*sheetIndex.length);
		if(x == 0){
			tempStr = '{"'+sheetIndex[x]+'": "'+result.data[i];
		}
		else if(x == sheetIndex.length - 1){
			tempStr += '", "'+sheetIndex[x]+'": "'+result.data[i]+'"}';
			jsonData.push(JSON.parse(tempStr));
		}
		else{
			tempStr += '", "'+sheetIndex[x]+'": "'+result.data[i];
		}
	}
	putDynamicComps();
	putStaticComps();
});
function putDynamicComps(){
	var todayIndex = 0;
	for(i = 1; (i < jsonData.length)&&(Date.parse(jsonData[i].date) < Date.now()); i++){
		todayIndex++;
	}	
	for(i = 1; i < todayIndex+1; i++){
		dayBox.push(document.createElement('div'));
		stitchBox.push(document.createElement('div'));
		stitch.push(document.createElement('div'));
		stitchBox[i-1].classList.add('container-stitch');
		stitch[i-1].classList.add('fill-stitch');
		stitch[i-1].style.background = 'hsl('+jsonData[i].hue+', '+jsonData[i].saturation+'%, '+jsonData[i].level+'%)';
		stitchBox[i-1].appendChild(stitch[i-1]);
		dayBox[i-1].classList.add('container-day');
		dayBox[i-1].appendChild(stitchBox[i-1]);
		daylist.appendChild(dayBox[i-1]);
		if(i == todayIndex){
			dayBox.push(document.createElement('div'));
			needleBox.appendChild(needleImage);
			dayBox[i].appendChild(needleBox);
			dayBox[i].classList.add('container-day');
			daylist.appendChild(dayBox[i]);
		}
	}
	viewport.appendChild(daylist);
	document.getElementsByClassName('container-body')[0].appendChild(viewport);
	LIST_LEFT = daylist.getBoundingClientRect().left;
	var eventRepeater = setInterval(function(){moveX(daylist)}, FRAMERATE);
}
function putStaticComps(){
	document.getElementsByClassName('container-body')[0].appendChild(dimLeft);
	document.getElementsByClassName('container-body')[0].appendChild(dimRight);
	document.getElementsByClassName('container-body')[0].appendChild(scrollBoxPrev);
	document.getElementsByClassName('container-body')[0].appendChild(scrollBoxNext);
}

/******************
 * DYNAMIC CONTROLS
 ******************/
document.getElementsByClassName('container-body')[0].onresize = function(){
	LIST_LEFT = daylist.getBoundingClientRect().left;
};
scrollBoxPrev.onmousemove = function(e){
	var w = this.getBoundingClientRect().width;
	var mX = e.clientX;
	var d = w - mX;
	v0 = HOVERSPEED*d/w;
};
scrollBoxPrev.onmouseout = function(e){
	v0 = 0;
};
scrollBoxNext.onmousemove = function(e){
	var w = this.getBoundingClientRect().width;
	var mX = e.clientX;
	var d = window.innerWidth - w - mX;
	v0 = HOVERSPEED*d/w;
};
scrollBoxNext.onmouseout = function(e){
	v0 = 0;
};
document.onwheel = function(e){
	acc = (-0.2)*e.deltaY;
	acc_t_count = ACC_T_INCREASE;
}


////////////////////////////////////////////////////////////////////////////////
/***********
 * FUNCTIONS
 ***********/
function moveX(obj){
	var x0 = obj.getBoundingClientRect().left;
	var x = x0 + v0 + vAcc();
	if(x > 0){
		x = 0;
	}
	else if(x < LIST_LEFT){
		x = LIST_LEFT;
	}
	else{
		//do nothing
	}
	setX(obj, x);
}
function vAcc(){
	var vA;
	if(acc_t_count > ACC_T_ZERO){
		vA = acc*(ACC_T_INCREASE - acc_t_count)/(ACC_T_INCREASE - ACC_T_ZERO)/2;
		acc_t_count--;
	}
	else if(acc_t_count > ACC_T_DECREASE){
		vA = acc;
		acc_t_count--;
	}
	else if(acc_t_count > 0){
		vA = acc -acc*(ACC_T_DECREASE - acc_t_count)/(ACC_T_ZERO - ACC_T_DECREASE)/2;
		acc_t_count--;
	}
	else{
		//do nothing
		vA = 0;
		acc = 0;
	}
	return vA;
}
function setX(obj, x){
	obj.style.left = x + "px";
}