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
var rexpDay = /01$/;
var rad_all = []; //total radius value
var DATA_LENGTH = 6; //date, day, spectrum, intensity, duration, note
var SCREEN_STATE_ENUM = Object.freeze({
	LIST: 1,
	END: 2,
	HELP: 3,
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
var removeList = [];
var removeListRandom;
var removeIntervalSwitch = []; //interval array
var recallIntervalSwitch = []; //interval array
//var url_parameter = "https://spreadsheets.google.com/pub?key=1IqZWY3edz2fGNT8O3uciprX6oElkLu8Vm8-i33CMNyk&hl=kr&output=html";
//var url_parameter = "https://spreadsheets.google.com/pub?key=16dYCHjSXG7FMwLAa-7c65TYiNZSJd2wOf-0CMN_efjA&hl=kr&output=html";
var url_parameter = "https://spreadsheets.google.com/pub?key="+getURLParameter('key')+"&hl=kr&output=html";
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
		$("#screen-beads").ready(function(){
			loadingEffect();
			putHelp();
			checkScroll();
			clickBeads();
			clickHelp();
			clickClose();
			clickArrow();
			putOverview();
	    drawOverview();
			clickOverview();
		});
	});
});
$(window).resize(function(){
	setBeadSize();
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
	/* create screen */
	var obj_screen = $("<div id='screen-beads' class='screen blur hide'><\/div>");
	var obj_container = $("<div id='container'><\/div>");
	$(obj_screen).append(obj_container);
	//retrieve radius
	setBeadSize();
	$.each(beadsObj, function(i, item){
		//retrieve color and fill image
		var rgba;
		var opacity = 0.4;
		var fill_image;
		if(rexpDay.test(item.date)){ //first day test
			fill_image = "src/img/" + item.date.slice(5,7)+".png";
		}
		else{
			fill_image = "src/img/fill_";
			if(item.spectrum > 0){
				opacity = 0.2 + 0.15 * Math.max(0, item.intensity-1);
				fill_image += item.spectrum + "_";
				if(item.intensity <= 3){
					fill_image += Math.round(Math.random() + 1) + ".png";
				}
				else{
					fill_image += Math.round(Math.random() * 2 + 1) + ".png";
				}
			}
			else{
				fill_image += Math.round(Math.random() * 4 + 1) + "_3.png";
			}
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
		var obj_placeholder = $("<div class='bead-placeholder'><\/div>");
		var obj_h_shadow = $("<div class='bead-point-h multiply'><\/div>");
		var obj_point_shadow = $("<div class='bead-point-shadow'><\/div>");
		var obj_h_bead = $("<div class='bead-point-h'><\/div>");
		var obj_point_bead = $("<div class='bead-point-bead'><\/div>");
		var obj_shadow = $("<div class='bead-shadow'></div>");
		var obj_bead = $("<div class='bead-base'></div>");
		var obj_filling = $("<div class='bead-filling'></div>");
		var obj_glow = $("<div class='bead-glow'></div>");
		$(obj_entry).attr('id', i);
		$(obj_shadow).addClass('bead-shadow-size-' + Math.max(1, item.duration));
		$(obj_bead).addClass('bead-size-' + Math.max(1, item.duration));
		$(obj_filling).addClass('bead-size-' + Math.max(1, item.duration));
		$(obj_glow).addClass('bead-size-' + Math.max(1, item.duration));
		$(obj_entry).css('height', 'calc(var(--d-' + Math.max(1, item.duration) + ') + var(--padding-min))');
		$(obj_placeholder).css('right', item.x);
		$(obj_shadow).css('background-color', item.color);
		$(obj_bead).css('background-color', item.color);
		//$(obj_bead).css('background-image', "url('bead_base.png'), url('"+item.filling+"'), url('bead_glow.png')");
		$(obj_filling).css('background-image', "url('"+item.filling+"')");
		$(obj_filling).css('transform', "translate(50%, -50%) rotate("+item.deg+"deg)");
		//put beads
		if(Date.parse(item.date) <= Date.now()){
			$(obj_point_shadow).append(obj_shadow);
			$(obj_point_bead).append(obj_bead);
			$(obj_point_bead).append(obj_filling);
			$(obj_point_bead).append(obj_glow);
			$(obj_h_shadow).append(obj_point_shadow);
			$(obj_h_bead).append(obj_point_bead);
			$(obj_placeholder).append(obj_h_shadow);
			$(obj_placeholder).append(obj_h_bead);
			$(obj_entry).append(obj_placeholder);
			$(obj_entry).appendTo(obj_container);
			item['y'] = $(obj_placeholder).offset().top;
			item['height'] = $(obj_entry).height();
			item['z'] = $(obj_entry).css('z-index');
		}
	});
	$(obj_screen).appendTo('body');
}


function loadingEffect(){
	var footer = "<div id='panel'><div class='innerbox'><h1 class='text-header'>"+cnt_year+"</h1><div id='help'>?</div><div id='panel-hit'></div></div></div>";
	var note = "<div id='note'><div class='innerbox'><h1></h1><p></p><div class='button-close'></div></div></div>";
	var screen = $("#screen-beads");
	$(screen).removeClass('blur');
	$(screen).addClass('sharp');
	$(screen).toggleClass('hide');
	screen.scrollTop($("#container").height());
	$(note).appendTo("body");
	$(footer).appendTo("body");
	$('#spinner').hide();
	$(screen).ready(function(){
		$('#panel').toggleClass('show');
	});
}

function clickBeads(){
	$(".bead-glow").click(function(){
		var target = $(this);
		if(screenState == SCREEN_STATE_ENUM.LIST){
			beadsExpand(target);
		}
		else if(screenState == SCREEN_STATE_ENUM.END){
			beadsList();
		}
	});

}

function beadsExpand(target){
	var entry = $(target).closest(".bead-entry");
	var placeholder = $(target).closest(".bead-placeholder");
	var screen = $(target).closest(".screen");
	var container = $("#container");
	removeList = [];
	/* set 'old' value */
	old.scroll = $(window).scrollTop();
	old.id = $(entry).attr('id');
	old.targetOffset = $(entry).offset().top;
	old.h = $(entry).height();
	/* lock scroll */
	$(screen).toggleClass('lock');
	/* animate */
	$('#panel').toggleClass('whiteout');
	$('.bead-entry').each(function(i, item){
		var restof = $(item).find('.bead-placeholder');
		var yPos = $(restof).offset().top;
		var windowY0 = $(window).scrollTop() - rad_all[4]*2;
		var windowY1 = windowY0 + $(window).height() + rad_all[4]*2;
		if(yPos >= windowY0 && yPos < windowY1){
			if(item.id != old.id){
				removeList.push(i);
			}
		}
		else{
			if(item.id != old.id){
			}
		}
	}).promise().done(function(){ //remove the other beads
		removeListRandom = ShuffleArray(removeList);
		removeIntervalSwitch = []; //reset interval array
		$.each(removeListRandom, function(i, item){
			var tempSwitch = setInterval(function(){
				var restofMove = $('#'+item).find('.bead-placeholder');
				$(restofMove).css('right', (-1)*($(window).width() - $(entry).width())/2 + (-1)*(rad_all[4]*2.5));
			}, i*50);
			removeIntervalSwitch.push(tempSwitch);
		});
		/* when it is finished to remove the other beads */
		setTimeout(function(){
			var entryHeight = $(window).height() - showNote();
			screenState = SCREEN_STATE_ENUM.END;
			$(placeholder).css('right', '50%');
			$(entry).css('height', entryHeight);
			/* scroll to the center */
			$(container).css({
				'-webkit-transform': 'translateY('+ (-1)*old.targetOffset +'px)',
				'transform': 'translateY('+ (-1)*old.targetOffset +'px)'
			});
			/* start motion animation */
			setTimeout(function(){
				emotionMotion($(entry).attr('id'));
			}, 300);
			$.each(removeIntervalSwitch, function(i, item){
				clearInterval(item);
			});
		},  50*(removeList.length+1));
	});
}

function beadsList(){
	var entry = $('#'+old.id);
	var placeholder = entry.children('.bead-placeholder');
	var screen = $(entry).closest('.screen');
	var container = $("#container");
	/*animation*/
	resetEmotionMotion(old.id);
	$(entry).css('height', 'calc(var(--d-' + Math.max(1, beads[parseInt(old.id)].duration) + ') + var(--padding-min))');
	$(placeholder).css('right', beads[old.id].x);
	$(container).css({
		'-webkit-transform': 'translateY(0px)',
		'transform': 'translateY(0px)'
	});
	setTimeout(hideNote(), 300);
	recallIntervalSwitch = []; //reset interval array
	$.each(removeListRandom, function(i, item){
		var tempSwitch = setInterval(function(){
			var restofMove = $('#'+item).find('.bead-placeholder');
			$(restofMove).css('right', beads[i].x);
		}, i*50);
		recallIntervalSwitch.push(tempSwitch);
	});
	setTimeout(function(){
		screenState = SCREEN_STATE_ENUM.LIST;
		$(screen).toggleClass('lock');
		//setScrollBehavior('body', 'auto');
		$.each(recallIntervalSwitch, function(i, item){
			clearInterval(item);
		});
	}, 50*(removeList.length+1));
}

function showNote(){
	var panel = $('#panel');
	var note = $('#note');
	var tempDate = new Date(beads[old.id].date);
	var dayKor = ['일', '월', '화', '수', '목', '금', '토'];
	var textDate = tempDate.getFullYear() + '년 '
								+ parseInt(tempDate.getMonth()+1) + '월 '
								+ parseInt(tempDate.getDate()) + '일, '
								+ dayKor[tempDate.getDay()] + '요일';
	$(note).children(".innerbox").children('h1').text(textDate);
	$(note).children(".innerbox").children('p').text(beads[old.id].note);
	$(panel).toggleClass('hide');
	$(note).toggleClass('visible');
	setTimeout(function(){
		$(note).toggleClass('show');
		$(note).removeClass('whiteout');
	}, 100);
	return($(note).height());
}

function hideNote(){
	var panel = $('#panel');
	var note = $('#note');
	$(panel).removeClass('whiteout');
	$(note).addClass('whiteout');
	$(note).removeClass('show');
	setTimeout(function(){
		$(panel).removeClass('hide');
		setTimeout(function(){
			$(note).removeClass('visible');
		},300);
	}, 300);
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

function setScrollBehavior(target, behavior){
	$(target).css('overflow-y', behavior);
}

function clickClose(){
  $('.button-close').click(function(){
    var target = $(this).closest('.screen');
    target.addClass('hide');
		switch(screenState){
			case SCREEN_STATE_ENUM.END:
				beadsList();
				screenState = SCREEN_STATE_ENUM.LIST;
				break;
			case SCREEN_STATE_ENUM.HELP:
				$("#screen-beads").removeClass('blur');
				$("#screen-beads").addClass('sharp');
				$("#screen-beads").removeClass('lock');
				$("#panel").removeClass('blur');
				$("#panel").addClass('sharp');
				screenState = SCREEN_STATE_ENUM.LIST;
				break;
			case SCREEN_STATE_ENUM.OVER:
				$("#screen-beads").removeClass('lock');
				screenState = SCREEN_STATE_ENUM.LIST;
				break;
		}
  });
}

function emotionMotion(id){
	/* modify animation variable */
	let root = document.documentElement;
	root.style.setProperty('--r', beads[parseInt(id)].rad + "px");
	root.style.setProperty('--deg-const', 180/Math.PI + "deg");
	root.style.setProperty('--deg-old', beads[parseInt(id)].deg + "deg");
	var i = parseInt(beads[parseInt(id)].spectrum);
	if(i != 0){
		$("#"+id+" .bead-point-h").css('animation', 'var(--effect-emotion-'+i+'-h)');
		$("#"+id+" .bead-point-bead").css('animation', 'var(--effect-emotion-'+i+'-bead)');
		$("#"+id+" .bead-point-shadow").css('animation', 'var(--effect-emotion-'+i+'-shadow)');
		$("#"+id+" .bead-filling").addClass('rotate-'+i);
	}
}

function resetEmotionMotion(id){
	var i = parseInt(beads[parseInt(id)].spectrum);
	$("#"+id+" .bead-point-h").css('animation', 'var(--effect-to-center)');
	$("#"+id+" .bead-point-bead").css('animation', 'var(--effect-to-center)');
	$("#"+id+" .bead-point-shadow").css('animation', 'var(--effect-to-center)');
	$("#"+id+" .bead-filling").removeClass('rotate-'+i);
	setTimeout(function(){
		$("#"+id+" .bead-point-h").css('animation', '');
		$("#"+id+" .bead-point-bead").css('animation', '');
		$("#"+id+" .bead-point-shadow").css('animation', '');
	}, 600);
}

function setBeadSize(){
	for(i = 1; i <= 5; i++){
		var target = "<div class='bead-size-"+i+"'></div>";
		var beadGhost = $(target).hide().appendTo("body");
		rad_all.push(parseInt(beadGhost.css('width').replace('px', '')));
		beadGhost.remove();
	}
}

function getURLParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam){
      return sParameterName[1];
    }
	}
}
