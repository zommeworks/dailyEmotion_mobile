function clickHelp(){
	$('#help').click(function(){
		$("#container").css('animation','');
		$("#screen-beads").removeClass('sharp');
		$("#screen-beads").addClass('blur');
		$("#panel").removeClass('sharp');
		$("#panel").addClass('blur');
		$("#screen-help").scrollTop(0);
		$("#screen-beads").addClass('lock');
		screenState = SCREEN_STATE_ENUM.HELP;
		drawHelp();
	});
}

function drawHelp(){
	$("#screen-help").ready(function(){
		$("#screen-help").toggleClass('hide');
	});
}

function putHelp(){
  var obj_screen = $("<div id='screen-help' class='screen hide'><\/div>");
  var obj_scroller = $("<div id='help-scroller'><\/div>");
  var obj_header = $("<div id='help-header' class='helpcontent textbox align-top'><div class=\"innerbox\"><\/div><\/div>");
  var obj_footer = $("<div id='help-footer' class='helpcontent textbox align-bottom'><div class=\"innerbox\"><\/div><\/div>");
  var obj_content = $("<div id='help-content' class='helpcontent canvasbox'><\/div>");
  /* contents */
  var content_wheel = $("<div id='help-colorwheel'><\/div>");
  var content_beadOpacity = [];
	var content_beadScale = [];
  /* put intialize texts */
  $(obj_header).children(".innerbox").append(cnt_title);
  $(obj_header).children(".innerbox").append(cnt_btn_x);
  $(obj_footer).children(".innerbox").append("<h2>"+ cnt_desc[0].h +"<\/h2>");
  $(obj_footer).children(".innerbox").append(cnt_btn_arrowdown);
  $(obj_footer).children(".innerbox").append("<p class='subtitle'>"+ cnt_desc[0].p +"<\/p>");
  /* put graphics on the content area */
	$(obj_content).append(content_wheel);
	$(obj_content, content_wheel).ready(function(){
		for(i = 0; i < 5; i++){
			var obj_opacity = $("<div id='help-bead-opacity-"+ (i + 1) +"'><\/div>");
			var obj_scale = $("<div id='help-bead-scale-"+ (i + 1) +"'><\/div>");
			if(i == 2){
				$(obj_scale).html("<img id='help-bead-shadow' src='src\/img\/bead_shadow_sample.png'></img><img id='help-bead-base' src='src\/img\/bead_base.png'></img><img id='help-bead-filling' src='src\/img\/fill_3_3.png'></img><img id='help-bead-glow' src='src\/img\/bead_glow.png'></img>");
			}
			content_beadOpacity.push(obj_opacity);
			content_beadScale.push(obj_scale);
			radialToCartesian(content_beadOpacity[i], content_wheel, obj_content, 0.83, 0, true);
			$(obj_content).append(content_beadOpacity[i]);
			$(obj_content).append(content_beadScale[i]);
		}
	});
  /* put text components on the screen */
  $(obj_content).appendTo(obj_screen);
  $(obj_header).appendTo(obj_screen);
  $(obj_footer).appendTo(obj_screen);
  $(obj_scroller).appendTo(obj_screen);
  $(obj_screen).appendTo("body");
}

function checkScroll(){
	var obj_content = $("#help-content");
  var content_wheel = $("#help-colorwheel");
  var content_beadOpacity = [];
	for(i = 0; i < 5; i++){
		var obj_op = $("#help-bead-opacity-"+i+1);
		content_beadOpacity.push(obj_op);
	}
	var beadOpacity_pos;
	var beadOpacity_dest_0;
	var beadOpacity_dest_1 = [];
	var beadOpacity_dest_2 = [];
	$(obj_content, content_wheel, content_beadOpacity[4]).ready(function(){
		var bead_gap = ($(content_wheel).width() - rad_all[1]) / 4;
		beadOpacity_pos = radialToCartesian(content_beadOpacity[4], content_wheel, obj_content, 0.83, 0, false);
		/* set position value for contents */
		beadOpacity_dest_0 = {
			x: ($(obj_content).width() + $(content_wheel).width() - rad_all[1]) / 2,
			y: beadOpacity_pos.y
		}
		for(i = 0; i < 5; i++){
			var x1 = $(obj_content).width()/2 + bead_gap * (i - 2);
			var y1 = beadOpacity_dest_0.y;
			var x2 = x1;
			var y2;
			switch(i){
				case 0:
					y2 = $(obj_content).height()/2/4*0;
					break;
				case 1:
					y2 = $(obj_content).height()/2/4*3;
					break;
				case 2:
					y2 = $(obj_content).height()/2/4*2;
					break;
				case 3:
					y2 = rad_all[0]+rad_all[1]/2 - (rad_all[0]+rad_all[1]+rad_all[2]+rad_all[3]+rad_all[4] - $(obj_content).height())/4;
					break;
				case 4:
					y2 = $(obj_content).height()/2/4*1;
					break;
			}
			var coord1 = {
				x: x1,
				y: y1
			}
			var coord2 = {
				x: x2,
				y: y2
			}
			beadOpacity_dest_1.push(coord1);
			beadOpacity_dest_2.push(coord2);
		}
	});
  $('#screen-help').scroll(function(){if(screenState == SCREEN_STATE_ENUM.HELP){
    var scr = - $("#help-scroller").offset().top / $(window).height();
    $(content_wheel).css({
      'opacity': rangeResult(scr, 0, 2/3, 1, 0, RANGE_LOCK.BOTH),
      'transform': 'translateY(calc('+rangeResult(scr, 1/3, 2/3, 0, -200, RANGE_LOCK.BOTH)+'px - 50%))'
    });
		$("#help-bead-opacity-5").css({
			'width': 'calc(' + rangeResult(scr, 0, 1/3, 1/4, 1, RANGE_LOCK.BOTH) + ' * var(--d-2))',
			'height': 'calc(' + rangeResult(scr, 0, 1/3, 1/4, 1, RANGE_LOCK.BOTH) + ' * var(--d-2))',
			'left': rangeResult(scr, 0, 1/2, beadOpacity_pos.x, beadOpacity_dest_0.x, RANGE_LOCK.BOTH),

		});
		for(i = 0; i < 4; i++){
			$("#help-bead-opacity-"+(i+1)).css({
				'left': rangeResult(scr, 0.5, 0.8, beadOpacity_dest_0.x, beadOpacity_dest_1[i].x, RANGE_LOCK.BOTH),
				'opacity': rangeResult(scr, 0.5, 0.8, 0, 1, RANGE_LOCK.START),
			});
		}
		for(i = 0; i < 5; i++){
			if( i != 3){
				$("#help-bead-opacity-"+(i+1)).css({
					'top': rangeResult(scr, 1.1, 1.5, beadOpacity_dest_1[i].y, beadOpacity_dest_2[i].y, RANGE_LOCK.BOTH),
					'opacity': rangeResult(scr, 1.1, 1.5, 1, 0, RANGE_LOCK.END),
				});
				if(i == 4){
					$("#help-bead-opacity-"+(i+1)).css({
						'top': rangeResult(scr, 1.1, 1.5, beadOpacity_dest_1[i].y, beadOpacity_dest_2[i].y, RANGE_LOCK.BOTH),
						'opacity': rangeResult(scr, 0, 1.1, 1, 1, RANGE_LOCK.START),
					});
				}
			}
			else{
				$("#help-bead-opacity-"+(i+1)).css({
					'top': rangeResult(scr, 1.1, 1.6, beadOpacity_dest_1[i].y, beadOpacity_dest_2[i].y, RANGE_LOCK.BOTH),
					'opacity': rangeResult(scr, 0.8, 1.6, 1, 1, RANGE_LOCK.NONE),
				});
			}
		}
		for(i = 0; i < 5; i++){
			var sumRad = 0;
			var tempDist = 0;
			for(j = 0; j < 5; j++){
				sumRad += rad_all[j];
			}
			if(i > 0){
				for(k = 0; k < i; k++){
						tempDist += rad_all[k];
				}
			}
			//tempDist += rad_all[i]/2 - (sumRad - $(obj_content).height())/50*i;
			tempDist += rad_all[i]/2 - (sumRad - $(obj_content).height())/4*i;
			$("#help-bead-scale-"+(i+1)).css({
				'left': rangeResult(scr, 1.2, 1.5 + 0.2*(4-i)/4, $(obj_content).width() + rad_all[i], beadOpacity_dest_1[3].x, RANGE_LOCK.START),
			});
			$("#help-bead-scale-"+(i+1)).css({
				'left': rangeResult(scr, 1.5 + 0.2*(4-i)/4, 2.1, beadOpacity_dest_1[3].x, beadOpacity_dest_1[3].x, RANGE_LOCK.NONE),
			});
			if(i == 2){
				$("#help-bead-scale-"+(i+1)).css({
					'left': rangeResult(scr, 2.1, 2.8, beadOpacity_dest_1[3].x, $(obj_content).width()/2, RANGE_LOCK.END),
					'top': rangeResult(scr, 2.1, 2.8, tempDist, $(obj_content).height()/2, RANGE_LOCK.BOTH),
					'border-width': rangeResult(scr, 2.1, 2.5, 2, 0, RANGE_LOCK.BOTH)
				});
				$("#help-bead-scale-"+(i+1)).children("#help-bead-base").css('opacity', rangeResult(scr, 2.4, 2.6, 0, 1, RANGE_LOCK.BOTH));
				$("#help-bead-scale-"+(i+1)).children("#help-bead-filling").css('opacity', rangeResult(scr, 2.5, 2.7, 0, 1, RANGE_LOCK.BOTH));
				$("#help-bead-scale-"+(i+1)).children("#help-bead-glow").css('opacity', rangeResult(scr, 2.6, 2.8, 0, 1, RANGE_LOCK.BOTH));
				$("#help-bead-scale-"+(i+1)).children("#help-bead-shadow").css({
					'opacity': rangeResult(scr, 2.4, 2.8, 0, 0.6, RANGE_LOCK.BOTH),
			});
			}
			else{
				$("#help-bead-scale-"+(i+1)).css({
					'left': rangeResult(scr, 2.1, 2.5, beadOpacity_dest_1[3].x, beadOpacity_dest_1[3].x + rad_all[1]*(1 - i), RANGE_LOCK.END),
					'top': rangeResult(scr, 2.1, 2.5, tempDist, -100 + rad_all[i]*i/2, RANGE_LOCK.BOTH),
					//rad_all[0]/2 + i*($(obj_content).height() - (rad_all[0] + rad_all[4])/2)/4
					'opacity': rangeResult(scr, 2.1, 2.3 + 0.2*(i)/4, 1, 0, RANGE_LOCK.BOTH)
				});
			}
		}
		/* replace bead */
		if(scr < 2){
			$("#help-bead-opacity-4").css('visibility', 'visible');
			$("#help-bead-scale-2").css('visibility', 'hidden');
		}else{
			$("#help-bead-opacity-4").css('visibility', 'hidden');
			$("#help-bead-scale-2").css('visibility', 'visible');
		}
		/* text animation */
		if(scr < 0.5){
			$("#help-footer").children(".innerbox").children("h2").html(cnt_desc[0].h);
			$("#help-footer").children(".innerbox").children("p").html(cnt_desc[0].p);
			$("#help-footer").children(".innerbox").children("h2").css('opacity', rangeResult(scr, 0.1, 0.4, 1, 0, RANGE_LOCK.BOTH));
			$("#help-footer").children(".innerbox").children("p").css('opacity', rangeResult(scr, 0.1, 0.4, 1, 0, RANGE_LOCK.BOTH));
		}
		else if(scr < 1.1){
			$("#help-footer").children(".innerbox").children("h2").html(cnt_desc[1].h);
			$("#help-footer").children(".innerbox").children("p").html(cnt_desc[1].p);
			$("#help-footer").children(".innerbox").children("h2").css('opacity', rangeResult(scr, 0.5, 0.8, 0, 1, RANGE_LOCK.BOTH));
			$("#help-footer").children(".innerbox").children("p").css('opacity', rangeResult(scr, 0.5, 0.8, 0, 1, RANGE_LOCK.BOTH));
		}
		else if(scr < 1.5){
			$("#help-footer").children(".innerbox").children("h2").html(cnt_desc[1].h);
			$("#help-footer").children(".innerbox").children("p").html(cnt_desc[1].p);
			$("#help-footer").children(".innerbox").children("h2").css('opacity', rangeResult(scr, 1.1, 1.4, 1, 0, RANGE_LOCK.BOTH));
			$("#help-footer").children(".innerbox").children("p").css('opacity', rangeResult(scr, 1.1, 1.4, 1, 0, RANGE_LOCK.BOTH));
		}
		else if(scr < 2.1){
			$("#help-footer").children(".innerbox").children("h2").html(cnt_desc[2].h);
			$("#help-footer").children(".innerbox").children("p").html(cnt_desc[2].p);
			$("#help-footer").children(".innerbox").children("h2").css('opacity', rangeResult(scr, 1.5, 1.8, 0, 1, RANGE_LOCK.BOTH));
			$("#help-footer").children(".innerbox").children("p").css('opacity', rangeResult(scr, 1.5, 1.8, 0, 1, RANGE_LOCK.BOTH));
		}
		else if(scr < 2.5){
			$("#help-footer").children(".innerbox").children("h2").html(cnt_desc[2].h);
			$("#help-footer").children(".innerbox").children("p").html(cnt_desc[2].p);
			$("#help-footer").children(".innerbox").children("h2").css('opacity', rangeResult(scr, 2.1, 2.4, 1, 0, RANGE_LOCK.BOTH));
			$("#help-footer").children(".innerbox").children("p").css('opacity', rangeResult(scr, 2.1, 2.4, 1, 0, RANGE_LOCK.BOTH));
		}
		else{
			$("#help-footer").children(".innerbox").children("h2").html(cnt_desc[3].h);
			$("#help-footer").children(".innerbox").children("p").html(cnt_desc[3].p);
			$("#help-footer").children(".innerbox").children("h2").css('opacity', rangeResult(scr, 2.5, 2.8, 0, 1, RANGE_LOCK.BOTH));
			$("#help-footer").children(".innerbox").children("p").css('opacity', rangeResult(scr, 2.5, 2.8, 0, 1, RANGE_LOCK.BOTH));
		}
		if(scr >= 2.5){
			$("#help-arrow").addClass("reverse");
		}
		else{
			$("#help-arrow").removeClass("reverse");
		}
  }});

}

function clickArrow(){
	$('#help-arrow').click(function(){
		var screen = $('#screen-help');
		var scr = - $("#help-scroller").offset().top / $(window).height();
		if(scr < 1){
			$(screen).stop().animate({
				scrollTop: 1 * $(window).height()
			}, 1000, 'swing');
		}
		else if(scr < 2){
			$(screen).stop().animate({
				scrollTop: 2 * $(window).height()
			}, 1000, 'swing');
		}
		else if(scr < 2.5){
			$(screen).stop().animate({
				scrollTop: 3 * $(window).height()
			}, 1000, 'swing');
		}
		else {
			$(screen).stop().animate({
				scrollTop: 0
			}, 1000, 'swing');
		}
	});
}
