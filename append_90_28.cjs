const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9028",
  "titleKo": "90.28 - 기체ㆍ액체ㆍ전기의 적산(積算)용 계기(그 검정용 계기를 포함한다)",
  "titleEn": "90.28 - Gas, liquid or electricity supply or production meters, including calibrating meters therefor.",
  "contentKo": "이 호에는 유량 속도가 아닌 누적 사용량(적산량)을 부피 또는 전력 단위로 카운트하여 표시하는 가스계량기, 수도계량기, 전기계량기(적산 전력계) 및 이들의 교정용 표준 계량기와 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 기체(가스)용 적산 계기(gas meter)(제9028.10호) :\n  - 습식 가스계량기 : 액체(물/기름)가 채워진 챔버 회전 드럼식 계량기, 회전 벨미터.\n  - 건식 가스계량기 : 피스톤식, 격막(diaphragm)식, 벨로우즈 신축식 작동 계기.\n- 액체용 적산 계기(liquid meter)(제9028.20호) : 가정용/공업용 수도계량기 및 액체(냉온수, 오일, 알코올, 맥주, 우유 등) 사용량 계량기.\n  - 익차식(fan wheel/impeller) 계량기(유속에서 부피 산출식).\n  - 격막식(diaphragm) 액체 계량기(피스톤식 습식 격막 작동).\n  - 피스톤식(왕복 피스톤식, 회전 피스톤식, 오실레이팅 디스크식) 계량기(용적형 positive displacement식).\n  - 단, 펌프와 결합된 급유용 펌프 계량 장치는 제8413호로 제외.\n- 전기용 적산 계기(적산 전력계)(제9028.30호) : 가정용/공업용 누적 전력량계(Wh, Ah 계량기).\n  - 전동기형(motor meter) 전력계 : 와전류 제동 유도 원반(eddy current brake)을 내장한 아날로그 전력계.\n  - 정전형(static/electronic) 전력계 : 전자식 연산 증배 소자 및 디지털 LCD 지시장치를 갖춘 전자식 전력계.\n  - 다율(multiple-rate) 전력계(시간대별 누적식), 선불형(prepayment) 전력계, 최대수요 전력계, 무효전력량계.\n  - 다른 계량기의 오차를 검정하는 교정용 표준 계량기(standard calibrating meter).\n- 부분품과 부속품(제9028.90호) : 가스/수도 계량기용 챔버 케이스, 전력계용 회전 원반 및 감속 기어 메커니즘, 적산 카운터 다이얼 레지스터.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단위시간 당 유량(속도)만을 지시하는 공업용 유량계 및 하천 유속계 (제9026호)\n(b) 단순히 순간적인 전류, 전압, 전력을 지시 측정하는 전압계, 전류계, 일반 전력계(단독제시 시) (제9030호)\n(c) 액체를 이송하기 위한 펌프를 내장하고 주유 용도로 사용되는 계량 펌프 (제8413호)" ,
  "contentEn": "This heading covers gas, liquid, or electricity supply or production meters (used to integrate and count the total volume or electrical quantity consumed), including calibrating meters therefor.\n\nIt includes :\n- Gas meters (subheading 9028.10) including wet meters (rotating drums in liquid) and dry meters (diaphragm or bellows type).\n- Liquid meters (subheading 9028.20) including inferential (fan-wheel or impeller type) and positive displacement (reciprocating or rotary piston, oscillating disc) water or oil meters.\n- Electricity meters (subheading 9028.30) including motor meters (with eddy current brake discs) and static electronic meters (multi-rate, prepayment, max-demand, or reactive meters).\n- Parts and accessories (subheading 9028.90).\n\nExcludes flowmeters indicating rate of flow (heading 90.26), separate non-integrating voltmeters, ammeters, or wattmeters (heading 90.30), and measuring pumps of heading 84.13."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.28 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
