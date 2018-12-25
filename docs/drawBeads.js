var COLORSET = [[180, 200, 190], [190, 24, 53], [217, 183, 37], [0, 91, 58], [0, 33, 157], [83, 39, 106]];
var beads = []; //beads object array
	/*{
		date: '',
		day: '',
		type: '',
		intensity: '',
		duration: '',
		note: 'string',
		color: 'rgba()', //color from type, alpha from intensity
		filling: 'image',
		rad: 'px', //from duration
		deg: ''
		x: 'px',
		y: 'px',
		z: '',
		height: ''
	}*/

var rad_all = []; //total radius value
var DATA_LENGTH = 6; //date, day, spectrum, intensity, duration, note
var SCREEN_STATE_ENUM = Object.freeze({
	LIST: 1,
	END: 2,
	DESC: 3,
	OVER: 4
});
var screenState;
var old = {
	scroll: '',
	id: ''
}
var url_parameter = "https://spreadsheets.google.com/pub?key=1IqZWY3edz2fGNT8O3uciprX6oElkLu8Vm8-i33CMNyk&hl=kr&output=html";
var googleSpreadsheet = new GoogleSpreadsheet();



/**************
 READ JSON FILE
***************/


$(document).ready(function(){
	screenState = SCREEN_STATE_ENUM.LIST;
	setCSS();
	loadSheetData(googleSpreadsheet);
	googleSpreadsheet.load(function(){
		putBeads(beads);
		loadingEffect();
		clickBeads();
	});
});

function setCSS(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		console.log('mobile browser');
	 	$("head").append("<link rel='stylesheet' href='style_mobile.css' type='text/css' media='screen' />");
	}
	else{
		console.log('pc browser');
		$("head").append("<link rel='stylesheet' href='style_mobile.css' type='text/css' media='screen' />");
	}
}

function loadSheetData(sheet){
	localStorage.clear();
	sheet.url(url_parameter);
	sheet.load(function(result) {
		var tempObj = {};
		var sheetIndex = [];// name list of object properties
		$.each(result.data, function(i, item){
			var col = Math.round((i/DATA_LENGTH - Math.floor(i/DATA_LENGTH))*DATA_LENGTH);
			if(Math.floor(i/DATA_LENGTH) == 0){
				sheetIndex.push(item);
			}
			else{
				var tempIndex = sheetIndex[col];
				tempObj[tempIndex] = item;
				if( col === DATA_LENGTH - 1){
					//update beads object
					beads.push(tempObj);
					tempObj = {};
				}
			}
		});
	});
}


function putBeads(beadsObj){
	//retrieve radius
	for(i = 1; i <= 5; i++){
		var target = "<div class='bead-size-"+i+"'></div>";
		var beadGhost = $(target).hide().appendTo("body");
		rad_all.push(beadGhost.css('width').replace('px', ''));
		beadGhost.remove();
	}
	$.each(beadsObj, function(i, item){
		//retrieve color and fill image
		var rgba;
		var opacity = 0.4;
		var fill_image = "fill_";
		if(item.spectrum > 0){
			opacity = 0.8 - 0.15 * Math.max(0, item.intensity-1);
			fill_image += item.spectrum + "_";
			if(item.intensity < 3){
				fill_image += "1.png";
			}
			else{
				fill_image += Math.round(Math.random() * 2 + 1) + ".png";
			}
		}
		else{
			fill_image += Math.round(Math.random() * 4 + 1) + "_" + Math.round(Math.random() + 2) + ".png";
		}
		rgba = [COLORSET[item.spectrum][0], COLORSET[item.spectrum][1], COLORSET[item.spectrum][2], opacity];
		// set color and fill image
		item['color'] = 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
		item['filling'] = fill_image;
		item['rad'] = rad_all[Math.max(0, item.duration - 1)]/2;
		item['deg'] = (0.5 - Math.random())*120;
		item['x'] = item.rad + Math.random()*120;
		//put beads
		var obj_entry = $("<div class='bead-entry'></div>");
		var obj_placeholder = $("<div class='bead-placeholder'></div>");
		var obj_shadow = $("<div class='bead-shadow'></div>");
		var obj_bead = $("<div class='bead-base'></div>");
		var obj_filling = $("<div class='bead-filling'></div>");
		var obj_glow = $("<div class='bead-glow'></div>");
		$(obj_entry).attr('id', i);
		$(obj_shadow).addClass('bead-shadow-size-' + Math.max(1, item.duration));
		$(obj_bead).addClass('bead-size-' + Math.max(1, item.duration));
		$(obj_filling).addClass('bead-size-' + Math.max(1, item.duration));
		$(obj_glow).addClass('bead-size-' + Math.max(1, item.duration));
		$(obj_entry).css('height', item.rad * 2 + 16 + 'px');
		$(obj_placeholder).css('right', item.x);
		$(obj_shadow).css('background-color', item.color);
		$(obj_bead).css('background-color', item.color);
		//$(obj_bead).css('background-image', "url('bead_base.png'), url('"+item.filling+"'), url('bead_glow.png')");
		$(obj_filling).css('background-image', "url('"+item.filling+"')");
		$(obj_filling).css('transform', "translate(50%, -50%) rotate("+item.deg+"deg)");
		//put beads
		if(Date.parse(item.date) <= Date.now()){
			$(obj_placeholder).append(obj_shadow);
			$(obj_placeholder).append(obj_bead);
			$(obj_placeholder).append(obj_filling);
			$(obj_placeholder).append(obj_glow);
			$(obj_entry).append(obj_placeholder);
			$(obj_entry).appendTo('#container');
			item['y'] = $(obj_placeholder).offset().top;
			item['height'] = $(obj_entry).height();
			item['z'] = $(obj_entry).css('z-index');
		}
	});
}


function loadingEffect(){
	var footer = "<div id=\"panel\"><h1 class=\"text-header\">2018년의 어느 날들</h1><\/div>";
	var note = "<div id=\"note\"><h1></h1><p></p><\/div>";
	window.scrollTo(0,$(document).height());
	$(note).appendTo('body');
	$(footer).appendTo('body');
}

function clickBeads(){
	$(".bead-glow").click(function(){
		var target = $(this);
		if(screenState == SCREEN_STATE_ENUM.LIST){
			beadsExpand(target);
		}
	});
	$("body").click(function(){
		if(screenState == SCREEN_STATE_ENUM.END){
			beadsList();
		}
	});

}
function beadsExpand(target){
	var entry = $(target).closest(".bead-entry");
	var placeholder = $(target).closest(".bead-placeholder");
	/* set 'old' value */
	old.scroll = $('html, body').scrollTop();
	old.id = $(entry).attr('id');
	/* animate */
	showNote();
	$(entry).animate({
		'margin-top': rad_all[4]*4,
		'height': $(window).height() - $('#panel').height()
	}, 300);
	$(placeholder).animate({
		right: '50%'
	}, 300);
	$('html, body').animate({
		'scrollTop': $(entry).offset().top + rad_all[4]*4
	}, 300, function(){
		screenState = SCREEN_STATE_ENUM.END;
		disableScroll();
	});
}

function beadsList(){
	var entry = $('#'+old.id);
	var placeholder = entry.children('.bead-placeholder');
	hideNote();
	$(entry).animate({
		'margin-top': 0,
		'height': beads[old.id].height
	}, 300);
	$(placeholder).animate({
		right: beads[old.id].x
	}, 300);
	$('html, body').animate({
		'scrollTop': old.scroll
	}, 300, function(){
		screenState = SCREEN_STATE_ENUM.LIST;
		enableScroll();
	});
}

function showNote(){
	var panel = $('#panel');
	var note = $('#note');
	$(note).children('h1').text(beads[old.id].date+". "+beads[old.id].day);
	$(note).children('p').text(beads[old.id].note);
	$(note).css('bottom', 0 - note.height());
	note.css('visibility', 'visible');
	panel.animate({
		'bottom': 0 - panel.height()
	}, 200, function(){
		note.animate({
			'bottom': 0
		}, 300);
	});
}

function hideNote(){
	var panel = $('#panel');
	var note = $('#note');
	console.log(note.height());
	note.animate({
		'bottom': 0 - note.height()
	}, 200, function(){
		panel.animate({
			'bottom': 0
		}, 300, function(){
			note.css('visibility', 'hidden');
		});
	});
}
