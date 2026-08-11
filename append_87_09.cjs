const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8709",
  "titleKo": "87.09 - 공장ㆍ창고ㆍ부두ㆍ공항에서 화물의 단거리 운반에 사용하는 형으로 권양(捲揚)용이나 취급용 장비가 결합되지 않은 자주식(自走式) 작업차, 철도역의 플랫폼에서 사용하는 형의 트랙터, 이들의 부분품",
  "titleEn": "87.09 - Works trucks, self-propelled, not fitted with lifting or handling equipment, of the type used in factories, warehouses, dock areas or airports for short distance transport of goods; tractors of the type used on railway station platforms; parts of the foregoing vehicles.",
  "contentKo": "이 호에는 공장, 창고, 부두, 공항, 철도역 등 한정된 영역 내에서 화물을 단거리 운송하거나 소형 트레일러를 견인하는 데 사용되는 자주식(자체 동력 구동식) 작업차 및 플랫폼용 트랙터(및 그 부분품)를 분류한다. 단, 물품의 권양(lifting) 또는 취급(handling)용 장비가 부착되지 않은 것으로 한정한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 플랫폼 운송차(작업트럭) : 화물 적재용 고정 또는 승강 플랫폼을 갖춘 차량(전기식 제8709.11호, 내연기관 등 기타식 제8709.19호).\n- 역 플랫폼용 트랙터 : 소형 트레일러를 끌거나 밀기 위해 설계된 마력이 낮고 가벼운 소형 트랙터(부두, 창고 입환용 포함).\n- 역 플랫폼 등에서 사용되는 수동 펌프 장착 소형 탱크차.\n- 보행 조종식(pedestrian-controlled) 자주식 운반차.\n- 이들 차량의 전용 부분품(제8709.90호) : 섀시, 차체, 플랫폼, 타이어 장착 바퀴, 클러치, 변속기어박스, 차축, 조향 핸들/바, 브레이크 및 피팅 단자가 부착된 조종 케이블.\n\n[제8701호, 제8703호, 제8704호와의 주요 구별 특징]\n1. 공공 도로 주행에 적합하지 않은 구조 및 사양.\n2. 화물 적재 시 최고 속도가 시속 30~35km 이하.\n3. 회전 반경이 차량의 전체 길이와 비슷할 정도로 극히 작음.\n4. 대개 폐쇄형 운전실이 없고 운전자가 서서 조종하는 단순 플랫폼 구조이거나 간이 조종석 구조임.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 컨테이너/장척 화물 취급용 크레인식 스트래들 캐리어 (제8426호)\n(b) 포크리프트(지게차) 및 승강 장치를 장착하여 하역을 수행하는 기타 작업트럭 (제8427호)\n(c) 토목 작업용 및 비고속도로용 덤프트럭 (제8704호)" ,
  "contentEn": "This heading covers self-propelled works trucks used for the short-distance transport of goods in factories, warehouses, docks, or airports, and tractors used on railway station platforms, provided they are not fitted with lifting or handling equipment.\n\nIt includes :\n- Self-propelled platform trucks and baggage carriers (electric: subheading 8709.11, other: subheading 8709.19).\n- Lightweight station platform tractors designed to tow small trailers.\n- Pedestrian-controlled self-propelled trucks.\n- Parts of the foregoing vehicles (subheading 8709.90) such as chassis, platforms, wheels, axles, clutches, steering bars, and brake components.\n\nKey Characteristics of Works Trucks (vs 87.01, 87.03, 87.04) :\n1. Constructed for off-road use, unsuitable for public highway transport.\n2. Maximum speed when loaded does not exceed 30 to 35 km/h.\n3. Small turning radius approximately equal to the vehicle's length.\n4. Absence of enclosed driver cabs (often standing-driver type).\n\nExcludes straddle carriers with cranes (heading 84.26), fork-lift trucks and other trucks fitted with lifts (heading 84.27), and dumpers (heading 87.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.09 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
