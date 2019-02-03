var fact = {
  year: 2019,
  tillNow: 1,
  recorded:1,
  adj1: '전반적으로',
  adj2: '행복했던',
  adjPrime: '행복했던',
  countPrime: 1,
}
var cnt_year = `${fact.year}년의 어느 날들`;
var cnt_overview_title = `${fact.year}년은 ${fact.adj1}<br>${fact.adj2} 한 해이다.`;
var cnt_overview_p1 = `${fact.year}년 중 ${fact.tillNow}일을 살았으며,`;
var cnt_overview_p2 = `그 중 기록을 남긴 날은 ${fact.recorded}일이다.`;
var cnt_overview_p3 = `기록한 날 중 ${fact.adjPrime} 날은 ${fact.countPrime}일이다.`;
const wordPool = {
  cnj: ['전반적으로', '자주 화가 나면서도', '꽤 신나는 한편', '대부분 행복하면서도', '대체로 평온한 가운데', '계속 우울하다가도'],
  adj: ['', '화가 나던', '신나던', '행복하던', '평온하던', '우울하던'],
  adjp: ['', '화가 났던', '신났던', '행복했던', '평온했던', '우울하던'],
}
const cnt_title = $("<h1>날마다 방울방울,<br>사리 남기기 프로젝트</h1>");
const cnt_desc = [
  {
    'h': '구슬의 색 - 감정의 종류',
    'p': '다섯 종류의 감정 중,<br>내가 느낀 것에 가장 가까운 것을 나타낸다.'
  },
  {
    'h': '구슬의 진하기 - 감정의 농도',
    'p': '그 감정이 얼마나 강했는지를<br>어림 짐작하여 다섯 단계 중 하나로 나타낸다.'
  },
  {
    'h': '구슬의 크기 - 감정의 길이',
    'p': '감정의 지속시간을 의미하며<br>가장 큰 것이 한나절에 해당된다.'
  },
  {
    'h': '',
    'p': '짤막한 메모를 더해 기록을 마치면<br>그날 하루에 대한 감정이 구슬로 표현된다.'
  }
];
const cnt_btn_x = $("<div class='button-close'><\/div>");
const cnt_btn_arrowdown = $("<div id='help-arrow'><div class='button-arrowdown'><\/div><\/div>");
