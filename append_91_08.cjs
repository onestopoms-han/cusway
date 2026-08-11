const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9108",
  "titleKo": "91.08 - 휴대용 시계의 무브먼트(movement)(완전한 것으로서 조립된 것으로 한정한다)",
  "titleEn": "91.08 - Watch movements, complete and assembled.",
  "contentKo": "이 호에는 케이스 없이 조립이 완료되어 즉시 작동 가능한 상태의 완전한 휴대용 시계용 무브먼트(watch movement)를 분류한다. 이 류 주 제3호에 따라 두께 12mm 이하, 폭/길이/지름 50mm 이하의 크기 기준을 충족해야 한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전기구동식 무브먼트(제9108.11~19호) :\n  - 기계식 표시부만을 갖추었거나 기계식 표시부를 결합할 수 있는 아날로그 바늘식 수정(쿼츠) 무브먼트(제9108.11호).\n  - 광전자식(opto-electronic) 표시부만을 갖춘 것(LED/LCD 디지털 디스플레이 패널 일체형 수정 무브먼트)(제9108.12호).\n  - 기타 전기 구동식 무브먼트(제9108.19호).\n- 기계식 무브먼트(자동권/기타)(제9108.20~90호) :\n  - 자동권(자동태엽감기) 기계식 무브먼트(제9108.20호).\n  - 수동 태엽식 기계식 무브먼트 및 기타 기계식 무브먼트(제9108.90호).\n\n[주요 사항]\n- 디지털 표시식(LED/LCD) 무브먼트의 경우 디스플레이 셀이 없으면 작동 및 표시가 불가능하므로, 디스플레이 셀이 부착되어 완전히 조립된 상태여야 이 호에 분류된다.\n- 이 호의 무브먼트 작동용 전지(배터리)나 축전지가 함께 제시되는 경우 전지의 포함 여부에 상관없이 이 호로 분류한다.\n- 91류 시계뿐만 아니라 측정 기기, 완구, 폭발 장치, 보수계(만보계) 등에 내장되는 크기 기준(12mm 이하 및 50mm 이하) 충족 무브먼트도 본 호에 분류된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 상기 규격(두께 12mm 이하, 폭 50mm 이하)을 초과하는 대형 클록용 무브먼트 (제9109호)\n(b) 조립되지 않았거나 미완성인 상태의 무브먼트 세트 (제9110호)\n(c) 탈진기가 없는 순수 스프링 기어 모터 (제8412호)" ,
  "contentEn": "This heading covers watch movements (as defined in Note 3: thickness <= 12 mm and width/length/diameter <= 50 mm) that are complete and assembled, presented without cases.\n\nIt includes :\n- Electrically operated watch movements (subheadings 9108.11 to 9108.19) including analog quartz (9108.11) and digital LCD/LED (9108.12) movements.\n- Mechanical watch movements (subheadings 9108.20 to 9108.90) including automatic winding (9108.20) and manual winding (9108.90).\n\nNote: For digital movements, the display cells must be present as they are essential for operation. Batteries presented with the movements are included."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.08 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
