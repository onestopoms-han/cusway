const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9017",
  "titleKo": "90.17 - 제도용구ㆍ설계용구ㆍ계산용구(예: 제도기ㆍ축소확대기ㆍ분도기ㆍ제도세트ㆍ계산척ㆍ계산반), 수지식 길이 측정용구[예: 곧은 자와 줄자ㆍ마이크로미터ㆍ캘리퍼스(callipers)](이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "90.17 - Drawing, marking-out or mathematical calculating instruments (for example, drafting machines, pantographs, protractors, drawing sets, slide rules, disc calculators); instruments for measuring length, for use in the hand (for example, measuring rods and tapes, micrometers, callipers), not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 아날로그 또는 수동식 제도/설계/수학 계산용구 및 작업자가 손에 쥐고 길이, 두께, 외경 등을 측정하는 수공구(마이크로미터, 캘리퍼스, 줄자 등)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 제도판을 갖춘 제도기(drafting machine)(제9017.10호) : 평행사변형 암 시스템을 내장한 수동 또는 자동식 제도기(컴퓨터 결합형 포함).\n- 그 밖의 제도/설계/계산용구(제9017.20호) :\n  - 제도용구 : 판토그래프(축소확대 사도기), 컴퍼스(compass), 디바이더(divider), 리덕션컴퍼스, 스프링컴퍼스, 제도용 펜, 삼각자 세트, T자, 운형자, 평행자, 분도기(protractor), 제도 전용 스텐실(stencil).\n  - 설계(marking-out)용구 : 빔컴퍼스, 화선기(scriber), 센터펀치(centre punch), 기준 정반, 주철/석제 직각자 및 직자, 가공물 고정용 V-블록/X-블록.\n  - 수학계산용구 : 아날로그 계산척(slide rule), 계산반(원반형 계산기), 사진 노출시간 산출용 수동식 원반/자 (단, 전자계산기/회계기는 제8470호로 제외).\n- 마이크로미터, 캘리퍼스 및 게이지(제9017.30호) :\n  - 마이크로미터(micrometer) : 나사식/슬라이드식(기계식, 다이얼식, 전자 디지털식).\n  - 캘리퍼스(callipers) : 버니어 캘리퍼스, 다이얼 캘리퍼스, 전자식 캘리퍼스.\n  - 조정식 게이지(조정 가능한 측정장치가 내장된 게이지에 한함).\n- 그 밖의 수지식 길이 측정용구(제9017.80호) :\n  - 기계식/다이얼식 비교측정기(comparator)(치수 공차 검사용).\n  - 곧은 자(measuring rod, 접이식/직선형), 줄자(tape measure)(용수철식, 리본식, 드럼식 권척).\n  - 삼각 스탠드 눈금자, 지도 거리 측정기(곡선계, opisometer).\n- 부분품과 부속품(제9017.90호) : 마이크로미터 연장 앤빌, 슬립게이지용 스탠드, 접이자용 경첩/조인트.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 기계 가공 및 조각용 가공 테이블 스탠드에 영구 고정되어 사용하는 고정식 측정 기기 (제9031호)\n(b) 고정식/조정 불가능한 한계 게이지(플러그 게이지, 링 게이지) (제9031호)\n(c) 석공, 목공, 기계공용 기포식 수준기(spirit level) 및 다림줄 (제9031호)\n(d) 그래픽용 디지타이저 및 펜 태블릿 (제8471호)\n(e) 반도체 제조용 마스크 패턴 묘화(노광) 장비 (제8486호)\n(f) 사진측량용 좌표도화기 (제9015호)\n(g) 측량 전용 사슬, 수준 조척, 상척 및 갱도 윈치식 권척 (제9015호)\n(h) 전자식 계산기 및 회계기 (제8470호)\n(ij) 수작업 조각용 모터 일체형 전동 공구 (제8467호)\n(k) 수동식 숫자 낙인 스탬프 (제9611호)\n(l) 삼각대 및 지지 마운트 (제9620호)" ,
  "contentEn": "This heading covers hand-operated instruments for drawing, marking-out, mathematical calculating, and linear measuring in the hand (such as drafting machines, slide rules, micrometers, callipers, and tapes).\n\nIt includes :\n- Drafting machines with drawing boards (subheading 9017.10) including automatic and computer-controlled versions.\n- Drawing, marking-out or calculating instruments (subheading 9017.20) including pantographs, dividers, drawing compasses, protractors, curves, scribers, center punches, surface plates, V-blocks, and slide rules.\n- Micrometers, callipers, and adjustable gauges (subheading 9017.30) (mechanical, dial, or digital electronic types).\n- Other hand-held measuring instruments (subheading 9017.80) such as dial-type comparators, measuring rods (folding/straight), spring or drum measuring tapes, map measurers (opisometers), and school rules.\n- Parts and accessories (subheading 9017.90).\n\nExcludes graphics tablets/digitizers (heading 84.71), photogrammetrical co-ordinatographs (heading 90.15), surveying chains/levelling staves (heading 90.15), non-adjustable limit gauges (plug/ring gauges) (heading 90.31 per Note 5), bubble levels and plumb lines (heading 90.31), calculators (heading 84.70), and tripods (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.17 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
