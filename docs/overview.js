function calculateYear(){
  var maxIndex;
  var dataEachType = [];
  for(i = 0; i <= 5; i++){ //from 0 to 5
    var tempData = {
      rad: 0,
      count: 0,
      intSum: 0,
      durSum:0,
      totSum: 0,
      totRat: 0,
      countMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    dataEachType.push(tempData);
  }
  $(beads).each(function(i, item){
    var eachType = dataEachType[item.spectrum];
    var tempMonth = new Date(item.date).getMonth();
    eachType.rad = degToRad(72*(3 - item.spectrum));
    eachType.count ++;
    eachType.intSum += parseInt(item.intensity);
    eachType.durSum += parseInt(item.duration);
    eachType.totSum += Math.sqrt(item.intensity * item.duration);
    eachType.countMonth[tempMonth]++;
    if(i == beads.length - 1){
      var maxSum = Math.max(dataEachType[1].totSum, dataEachType[2].totSum, dataEachType[3].totSum, dataEachType[4].totSum, dataEachType[5].totSum);
      for(j = 1; j <= 5; j++){
        dataEachType[j].totRat = dataEachType[j].totSum / maxSum;
        if(dataEachType[j].totSum == maxSum){
          maxIndex = j;
        }
      }
    }
  });
  for(i = 1; i <= 5; i++){
    console.log(dataEachType[i]);
    console.log(maxIndex);
  }
}
