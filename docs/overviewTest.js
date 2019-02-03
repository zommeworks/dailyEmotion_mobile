var url_parameter = "https://spreadsheets.google.com/pub?key=16dYCHjSXG7FMwLAa-7c65TYiNZSJd2wOf-0CMN_efjA&hl=kr&output=html";
var googleSpreadsheet = new GoogleSpreadsheet();
var beads = []; //beads object array
var DATA_LENGTH = 6; //date, day, spectrum, intensity, duration, note





$(document).ready(function(){
	loadSheetData(googleSpreadsheet);
	googleSpreadsheet.load(function(){
    putOverview();
    drawOverview();
  });
});





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



function calculateYear(){
  var primaryTemp = {
    index: 0,
    value: 0,
  };
  var secondaryTemp ={
    index: 0,
    value: 0,
  }
  var dataEachType = [];
  var dateTillNow = 0;
  var output;
  var isObvious = false;
  for(i = 0; i <= 5; i++){ //from 0 to 5
    var tempData = {
      rad: 0,
      count: 0,
      intensitySum: 0,
      durationSum:0,
      sqrtSum: 0,
      sqrtRatio: 0,
      sqrtMean: 0,
      countMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    dataEachType.push(tempData);
  }
  $(beads).each(function(i, item){
    var eachType = dataEachType[item.spectrum];
    var tempMonth = new Date(item.date).getMonth();
    eachType.rad = degToRad(72*(3 - item.spectrum));
    eachType.count ++;
    eachType.intensitySum += parseInt(item.intensity);
    eachType.durationSum += parseInt(item.duration);
    eachType.sqrtSum += Math.sqrt(item.intensity * item.duration);
    eachType.countMonth[tempMonth]++;
    if(tempMonth < (new Date()).getMonth()){
      dateTillNow++;
    }
    else if(tempMonth == (new Date()).getMonth()){
      if((new Date(item.date)).getDate() <= (new Date()).getDate()){
        dateTillNow++;
      }
    }
    if(i == beads.length - 1){
      var secondaryArray = [];
      var maxSum = Math.max(dataEachType[1].sqrtSum, dataEachType[2].sqrtSum, dataEachType[3].sqrtSum, dataEachType[4].sqrtSum, dataEachType[5].sqrtSum);
      for(j = 1; j <= 5; j++){
        dataEachType[j].sqrtMean = dataEachType[j].sqrtSum / dataEachType[j].count;
        if(dataEachType[j].sqrtSum == maxSum){//find primary
          primaryTemp.index = j;
          primaryTemp.value = dataEachType[j].sqrtSum;
        }
        else{
          secondaryArray.push(dataEachType[j].sqrtSum);
        }
      }
      var secSum = Math.max(secondaryArray[0], secondaryArray[1], secondaryArray[2], secondaryArray[3]);
      for(j = 1; j <= 5; j++){
        if(dataEachType[j].sqrtSum == secSum){//find secondary
          secondaryTemp.index = j;
          secondaryTemp.value = dataEachType[j].sqrtSum;
          if(secondaryTemp.value < primaryTemp.value/2){//test if primary value is twice bigger than secondary
            isObvious = true;
          }
          else{
            isObvious = false;
          }
        }
      }
    }
  });
  /*set relative value to draw the diagram*/
  for(i = 1; i <= 5; i++){
    dataEachType[i].sqrtRatio = (dataEachType[i].sqrtSum / dataEachType[primaryTemp.index].sqrtSum);
  }
  output = {
    byType: dataEachType,
    primary: primaryTemp,
    secondary: secondaryTemp,
    obvious: isObvious,
    tillNow: dateTillNow,
    recTillNow: dataEachType[1].count + dataEachType[2].count + dataEachType[3].count + dataEachType[4].count + dataEachType[5].count,
  };
  console.log(output);
  return output;
}

function putOverview(){
  var overviewData = calculateYear();
  setFacts(overviewData);
  var obj_screen = $("<div id='screen-overview' class='screen'></div>");
  var obj_container = $("<div id='overview-container'></div>");
  var obj_page1 = $("<div class='overview-page'></div>");
  var obj_canvasbox = $("<div id='overview-canvasbox'><canvas id='overview-canvas'></canvas></div>");
  var obj_footer = $("<div id='overview-footer' class='textbox'><div class='innerbox'><h1></h1><p id='overview-p1' class='small'></p><p id='overview-p2' class='small'></p><p id='overview-p3' class='small'></p></div></div>");
  var obj_header = $("<div id='overview-header' class='textbox'><div class='innerbox'><h1 class='text-header'></h1></div></div>");
  $(obj_footer).children('.innerbox').children('h1').html(cnt_overview_title);
  $(obj_footer).children('.innerbox').children('#overview-p1').html(cnt_overview_p1);
  $(obj_footer).children('.innerbox').children('#overview-p2').html(cnt_overview_p2);
  $(obj_footer).children('.innerbox').children('#overview-p3').html(cnt_overview_p3);
  $(obj_header).children('.innerbox').children('h1').html(cnt_year);
  $(obj_header).children(".innerbox").append(cnt_btn_x);
  $(obj_page1).append(obj_canvasbox);
  $(obj_page1).append(obj_footer);
  $(obj_page1).appendTo(obj_container);
  $(obj_screen).append(obj_container);
  $(obj_screen).append(obj_header);
  $(obj_screen).appendTo('body');
}

function drawOverview(){
  var obj_canvas = document.getElementById('overview-canvas');
  var r = 600;
  var ctx = obj_canvas.getContext('2d');
  var center = {
    x: r,
    y: r,
  }
  var strokeWidth = r/90;
  var overviewData = calculateYear();
  var img = new Image();
  img.src = 'src/img/illust_chromecirclefull.png';
  $("#overview-canvas").attr({
    'width': 2*r,
    'height': 2*r,
  });
  /* draw UI comps */

  /* draw graph */
  img.onload = function(){
    ctx.save();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = strokeWidth*2;
    ctx.beginPath();
    ctx.moveTo(center.x + Math.cos(Math.PI*2/5*2)*r*overviewData.byType[1].sqrtRatio,
               center.y - Math.sin(Math.PI*2/5*2)*r*overviewData.byType[1].sqrtRatio);
    for(i = 1; i <= 5 ; i++){
      if(i == 5){
        ctx.lineTo(center.x + Math.cos(overviewData.byType[1].rad)*r*overviewData.byType[1].sqrtRatio,
                   center.y - Math.sin(overviewData.byType[1].rad)*r*overviewData.byType[1].sqrtRatio);
      }
      else{
        ctx.lineTo(center.x + Math.cos(overviewData.byType[i+1].rad)*r*overviewData.byType[i+1].sqrtRatio,
                   center.y - Math.sin(overviewData.byType[i+1].rad)*r*overviewData.byType[i+1].sqrtRatio);
      }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0);
    /* draw lines */
    ctx.restore();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = strokeWidth;
    for(i = 1; i <= 5 ; i++){
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(center.x + Math.cos(Math.PI*2/5*i)*r, center.y + Math.sin(Math.PI*2/5*i)*r);
      ctx.stroke();
      ctx.closePath();
    }
    ctx.beginPath();
    ctx.moveTo(center.x + r, center.y);
    for(i = 1; i <= 5 ; i++){
      ctx.lineTo(center.x + Math.cos(Math.PI*2/5*i)*r, center.y + Math.sin(Math.PI*2/5*i)*r);
    }
    ctx.stroke();
    ctx.closePath();
  };
}

function setFacts(data){
  fact.tillNow = data.tillNow;
  fact.recorded = data.recTillNow;
  if(data.obvious){
    fact.adj1 = wordPool.cnj[1];
    fact.adj2 = wordPool.adj[data.primary.index];
  }
  else{
    fact.adj1 = wordPool.cnj[data.primary.index];
    fact.adj2 = wordPool.adj[data.secondary.index];
  }
  fact.adjPrime = wordPool.adjp[data.primary.index];
  fact.countPrime = data.byType[data.primary.index].count;
  ////////
  cnt_year = `${fact.year}년의 어느 날들`;
  cnt_overview_title = `${fact.year}년은 ${fact.adj1}<br>${fact.adj2} 한 해이다.`;
  cnt_overview_p1 = `${fact.year}년 중 ${fact.tillNow}일을 살았으며,`;
  cnt_overview_p2 = `그 중 기록을 남긴 날은 ${fact.recorded}일이다.`;
  cnt_overview_p3 = `기록한 날 중 ${fact.adjPrime} 날은 ${fact.countPrime}일이다.`;
  console.log(cnt_year);
  console.log(cnt_overview_title);
  console.log(cnt_overview_p1);
  console.log(cnt_overview_p2);
  console.log(cnt_overview_p3);
}
