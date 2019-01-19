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
var scrollLock;
var old = {
	scroll: '',
	id: '',
	targetOffset: '',
	h: ''
}
var url_parameter = "https://spreadsheets.google.com/pub?key=1IqZWY3edz2fGNT8O3uciprX6oElkLu8Vm8-i33CMNyk&hl=kr&output=html";
var googleSpreadsheet = new GoogleSpreadsheet();



/**************
 READ JSON FILE
***************/

$(document).on('contextmenu', function(){
	return false;
});

$(document).ready(function(){
	screenState = SCREEN_STATE_ENUM.LIST;
	setCSS();
	loadSheetData(googleSpreadsheet);
	googleSpreadsheet.load(function(){
		putBeads(beads);
		loadingEffect();
		clickBeads();
		clickHelp();
		freezeScroll();
	});
});

function setCSS(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		//console.log('mobile browser');
	 	$("head").append("<link rel='stylesheet' href='style_mobile.css' type='text/css' media='screen' />");
	}
	else{
		//console.log('pc browser');
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
	var footer = "<div id=\"panel\"><h1 class=\"text-header\">2018년의 어느 날들</h1><div id=\"help\">?<\/div><\/div>";
	var note = "<div id=\"note\"><h1></h1><p></p><\/div>";
	$('#container').css('animation', 'var(--effect-fadein) running');
	window.scrollTo(0,$(document).height());
	$(note).appendTo('body');
	$(footer).appendTo('body');
	$('#spinner').hide();
	setTimeout(function(){
		$('#panel').addClass('show');
	}, 100);
	//$('#panel').css('animation', 'var(--effect-panel-up) running');
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
	var newValue = {
		'm': rad_all[4]*4,
		'h': $(window).height() - $('#note').height()
	}
	/* set 'old' value */
	old.scroll = $(window).scrollTop();
	old.id = $(entry).attr('id');
	old.targetOffset = $(entry).offset().top;
	old.h = $(entry).height();
	/* local constant definition */
	const d = newValue.h/2 - old.h/2 + old.scroll - old.targetOffset;
	/* animate margin */
	showNote();
	$(entry).css({'margin-top': newValue.m, 'margin-bottom': newValue.m, 'height': newValue.h});
	setAnimation(placeholder, 'var(--effect-bead-center)');
	/* animate scroll */
	var intervalCount = 0;
	var currentY;
	var newScrollTop;
	currentY = old.targetOffset + old.h/2 - old.scroll; //initialize y value
	setInterval(function(){
		if(intervalCount < 30){
			currentY += d / 30;
			newScrollTop = $(placeholder).offset().top - currentY;
			$(window).scrollTop(newScrollTop);
			intervalCount++;
		}
		else{
			setScrollBehavior('body', 'hidden');
			screenState = SCREEN_STATE_ENUM.END;
			clearInterval();
		}
	}, 10);
	/*
	$(entry).animate({
		'margin-top': rad_all[4]*4,
		'height': $(window).height() - $('#note').height()
	}, 300);
	*/
	/*
	$(entry).css({'margin-top': newValue.m, 'margin-bottom': newValue.m, 'height': newValue.h});
	setAnimation(placeholder, 'var(--effect-bead-center)');
	$('html, body').animate({
		'scrollTop': $(entry).offset().top + newValue.m
	}, 300, function(){
		screenState = SCREEN_STATE_ENUM.END;
	});
	*/
}

function beadsList(){
	var entry = $('#'+old.id);
	var placeholder = entry.children('.bead-placeholder');
	hideNote();
	$('body').css('overflow', 'auto');
	/*
	$(entry).animate({
		'margin-top': 0,
		'height': beads[old.id].height
	}, 300);
	*/
	$(entry).css({'margin-top': 0, 'margin-bottom': 0, 'height': beads[old.id].height});
	setAnimation(placeholder, 'var(--effect-bead-back)');
	$('html, body').animate({
		'scrollTop': old.scroll
	}, 300, function(){
		screenState = SCREEN_STATE_ENUM.LIST;
		setScrollBehavior('body', 'auto');
	});
}

function showNote(){
	var panel = $('#panel');
	var note = $('#note');
	$(note).children('h1').text(beads[old.id].date+". "+beads[old.id].day);
	$(note).children('p').text(beads[old.id].note);
	//$(note).css('bottom', panel.height - note.height);
	$(panel).addClass('hide');
	$(note).addClass('visible');
	setTimeout(function(){
		$(note).addClass('show');
	}, 100);
}

function hideNote(){
	var panel = $('#panel');
	var note = $('#note');
	$(note).removeClass('show');
	setTimeout(function(){
		$(panel).removeClass('hide');
		setTimeout(function(){
			$(note).removeClass('visible');
		},300);
	}, 300);
	/*
	note.animate({
		'bottom': 0 - note.height()
	}, 200, function(){
		panel.animate({
			'bottom': 0
		}, 300, function(){
			note.css('visibility', 'hidden');
		});
	});
	*/
}

function setScrollBehavior(target, behavior){
	$(target).css('overflow-y', behavior);
}

function clickHelp(){
	$('#help').click(function(){
		setScrollBehavior('body', 'hidden');
		setAnimation('#container', 'var(--effect-blur)');
		setAnimation('#panel', 'var(--effect-blur)');
		//$('#container').css('animation', 'var(--effect-blur) running');
		//$('#panel').css('animation', 'var(--effect-blur) running');
	});
}

function setAnimation(obj, behavior){
	$(obj).css('animation', null);
  window.requestAnimationFrame(function(time) {
    window.requestAnimationFrame(function(time) {
      $(obj).css('animation', behavior);
    });
  });
	/*
	$(obj).on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
		if(resetAnimation){
			$(obj).css('animation', '');
		}
	});
	*/
}

function freezeScroll(){
	while(screenState == SCREEN_STATE_ENUM.END){
		var yPos = old.targetOffset + rad_all[4]*4;
		scrollLock = setInterval(function(){
			$(window).scrollTop(yPos);
		}, 1);
	}
}
