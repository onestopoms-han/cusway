const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9114",
  "titleKo": "91.14 - 그 밖의 시계의 부분품",
  "titleEn": "91.14 - Other clock or watch parts.",
  "contentKo": "이 호에는 제91류에 속하는 모든 시계 및 시간 계측기기용 부분품 중에서, 91류의 다른 호(완제 무브먼트, 조립 세트, 케이스, 시곗줄 등)에 속하지 않고 범용 부분품에도 해당하지 않는 기타 전용 부분품(스프링, 기어 윤열, 주얼 베어링, 문자판, 지침 등)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 문자판(dial)(제9114.30호) : 금속, 에나멜 동판, 유리, 플라스틱 등으로 제작된 시간 지시용 눈금 및 숫자판(형광 기호 포함).\n- 지판과 브리지(plate and bridge)(제9114.40호) : 무브먼트 기어들을 지지하는 기판(지판) 및 고정용 프레임(브리지).\n- 기타 부분품(제9114.90호) :\n  - 무브먼트 스프링 : 구동력 공급용 메인스프링(태엽) 및 밸런스 휠 제어용 헤어스프링(유사 스프링 포함).\n  - 기어 윤열(train) 및 태엽통(barrel), 기어 아버(arbor) 및 피니언(pinion).\n  - 탈진기(escapement) 부분품 : 탈진륜(escape wheel), 레버(anchor), 팰릿 스태프, 롤러, 임펄스 핀.\n  - 조정장치 및 탈진 블록(플랫폼 탈진기 platform escapement).\n  - 용두(crown), 권양/지침맞춤 스핀들, 클러치 휠, 세팅 레버 및 관련 스프링.\n  - 전용 전자 회로 부품 : IC칩이 장착된 집적 전자회로판(PCB), 전기 구동 코일, 수정 진동자 마운트.\n  - 클록 전용 부품 : 추가 달린 보정 진자(pendulum), 진동용 크러치(crutch), 버즈, 감기용 키(winding key).\n  - 자명종/클록용 타종장치(striking work) : 타종 해머, 록킹 플레이트, 래크, 스네일, 공(gong) 및 차임벨 소출용 쇠틀.\n  - 가공된 보석(jewel) : 루비, 사파이어 등으로 제작된 축받이용 주얼 베어링(천공 주얼, 엔드스톤 주얼, 팰릿 스톤, 롤러 주얼).\n  - 지침(hand) : 철강, 황동 등으로 제작된 시침, 분침, 초침 및 크로노그래프 지침(형광 창이 있는 것 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 미가공 또는 황동판 등으로 단순히 형태만 깎고 구멍을 뚫지 않은 금속판 (재질별 분류)\n(b) 범용성 나사, 볼트, 리벳, 핀 및 금속 체인 (제15부 또는 제39류)\n(c) 단독 제시되는 시계 유리(glass) 및 추(weight) (재질별 분류)\n(d) 완제/조립 무브먼트 (제9108호, 제9109호) 및 케이스 (제9111호, 제9112호)" ,
  "contentEn": "This heading covers other parts for clocks, watches, and timekeepers that are not specified or included in other headings of Chapter 91, and not excluded by Note 1.\n\nIt includes :\n- Dials (subheading 9114.30) of metal, enamel, or plastics.\n- Plates and bridges (subheading 9114.40) forming the frame of movements.\n- Other parts (subheading 9114.90) including mainsprings, hairsprings, gear trains, arbors, escapements (escape wheels, anchors), platform escapements, watch crowns, electronic circuits (PCBs), pendulums, striking hammers, gongs, worked jewel bearings (rubies, sapphires), and hands."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.14 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
