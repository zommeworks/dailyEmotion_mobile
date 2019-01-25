var SCREEN_STATE_ENUM = Object.freeze({
	LIST: 1,
	END: 2,
	DESC: 3,
	OVER: 4
});
var screenState;





$(document).on('contextmenu', function(){
	return false;
});

$(document).ready(function(){
	screenState = SCREEN_STATE_ENUM.DESC;
	setCSS();
  drawHelp();
  clickClose();
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

function drawHelp(){
  var obj_screen = $("<div id='screen-help' class='screen hide'><\/div>");
  var obj_scroller = $("<div id='help-scroller'><\/div>");
  var obj_header = $("<div id='help-header' class='helpcontent textbox align-top'><\/div>");
  var obj_footer = $("<div id='help-footer' class='helpcontent textbox align-bottom'><\/div>");
  var obj_canvas = $("<canvas id='help-canvas' class='helpcontent canvasbox'><\/canvas>");
  /* put intialize texts */
  $(obj_header).append(cnt_title);
  $(obj_header).append(cnt_btn_x);
  $(obj_footer).append("<h2>"+ cnt_desc[0].h +"<\/h2>");
  $(obj_footer).append(cnt_btn_arrowdown);
  $(obj_footer).append("<p class='subtitle'>"+ cnt_desc[0].p +"<\/p>");
  /* put graphics on the canvas */

  /* put text components on the screen */
  $(obj_canvas).appendTo(obj_screen);
  $(obj_header).appendTo(obj_screen);
  $(obj_footer).appendTo(obj_screen);
  $(obj_screen).appendTo("body");
  /* calculate canvas size and put it on the screen */
  setTimeout(function(){
    $(obj_screen).toggleClass('hide');
  }, 100);
  /*
  $('#help-canvas').css({
    'top': $('#help-header').height(),
    'height': 'calc(100vh -' + $('#help-header').height() + $('#help-footer').height() +')'
  });
  */
}

function clickClose(){
  $('.button-close').click(function(){
    var target = $(this).closest('.screen');
    target.addClass('hide');
  });
}
