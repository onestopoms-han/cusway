const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8479",
  "titleKo": "84.79 - 이 류에 따로 분류되지 않은 기계류(고유의 기능을 가진 것으로 한정한다)",
  "titleEn": "84.79 - Machines and mechanical appliances having individual functions, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 고유의 기능(다른 기기로부터 독립하여 작용하거나, 복합기계에 결합되더라도 전체 작동에 필수불가결하지 않고 독자적인 기능을 수행하는 것)을 가진 기계류로서 이 류에 따로 분류하지 않은 것을 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n\n(Ⅰ) 범용(汎用)성 기계류\n(1) 기계식 장치가 부착된 전해조 등의 용기 (단, 가열/조리용 등 제외)\n(2) 특정 용도나 특정 공업용이 아닌 일반 프레스, 파쇄기, 혼합기\n(3) 기계식 호퍼 피드(hopper feed) 등 범용 용적식 분배장치\n(4) 범용 아이렛팅기(eyeletting), 관상 리벳팅기, 벨트 스테이플러\n(5) 진동 모터 및 전자(電磁) 진동기\n(6) 다용도의 산업용 로봇 (용접/페인팅 등 툴만 바꾸어 여러 용도로 쓰는 것)\n\n(Ⅱ) 특정산업용의 기계류\n(A) 토목, 건축 등 용도 : 모르타르/콘크리트 살포기, 콘크리트 진동 다짐기, 도로용 자갈/아스팔트 살포 다짐기, 보행식 노면 청소기 및 백선 표시기, 제설용 염화칼슘/모래 살포기 등.\n(B) 기름, 비누, 식용지방 공업용 : 채유용 분쇄기/프레스, 비누 절단 및 성형기 등.\n(C) 목재/코르크 처리용 : 박피용 드럼, 목재 섬유/칩/코르크분 응결용 프레스, 가압 목재 침투기 등.\n(D) 로프 및 케이블 제조기 (연선기, 제선기, 전선 꼬는 기계 등, 단 방적사 연사기 제외).\n(E) 금속처리용 : 알루미늄-열(테르밋) 용접용 도가니 바이스프레스, 금속 산세척기, 볼베어링 등 연마용 회전드럼, 침지식 주석도금 장치, 전선 코일 와인더(coil-winder) 등.\n(F) 바구니/지조 세공용 및 초작물 엮는 기계 (밀짚싸개 제조기 등).\n(G) 브러시 제조용 기계\n\n(Ⅲ) 그 밖의 여러 가지 기계류\n(1) 공기 가습기 및 제습기 (가정용 등 타 호 분류 제외)\n(2) 기계식, 액압식, 압축공기식 엔진 시동장치\n(3) 액압식 축압기 (hydraulic accumulator)\n(4) 펌프형 자동 그리스 주입기\n(5) 성냥 화학액 침지기\n(6) 통(cask) 타르 도포기\n(7) 용접봉 피복기\n(8) 인쇄용 젤라틴 롤러 청정기\n(9) 유리의 산(酸) 처리기\n(10) 볼트 체결기/해체기 및 철심 추출기 (수공구, 수지식 제외)\n(11) 파이프라인 청소 및 피복기\n(12) 침포실린더 침포 장착기\n(13) 깃털 먼지제거 및 세정기, 매트리스 충전기\n(14) 수초(水草) 절단기\n(15) 자이로 안정기(gyroscopic stabiliser) 및 선박용 조타장치\n(16) 와이퍼 블레이드가 장착된 선박/항공기/기타 차량용 와이퍼 (자전거, 자동차용 제외)\n(17) 초음파 세정기 및 초음파 변환기 (반도체/평판디스플레이 세정용 제외)\n(18) 수중 취관(underwater blowpipe)\n(19) 산소 란스를 이용한 암석/콘크리트 용융 절단 및 천공기\n(20) 자동 구두닦이(shoe brushing machine)\n(21) 종이컵 왁스 도포기\n(22) 공업용 바닥연마기\n(23) 증발식 에어쿨러 및 탑승교(passenger boarding bridge)\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 주형(mould)(제8480호 등 타 호 분류 외의 것)도 이 호에 분류한다.",
  "contentEn": "This heading covers machines and mechanical appliances having individual functions, not specified or included elsewhere in this Chapter.\n\nIt includes :\n(I) General purpose machinery (vats with mechanical devices, general purpose presses, vibratory motors, multi-purpose industrial robots).\n(II) Specialized machinery for specific industries (road-building/concrete vibratory finishers, soap cutters/moulders, wood chip or cork agglomerating presses, rope-making or cabling machines, Termit welding crucibles, coil-winders, brush-making machinery).\n(III) Miscellaneous machines (air humidifiers/dehumidifiers, hydraulic accumulators, automatic grease dispensers, pipeline cleaners, ultrasonic cleaners, evaporative air coolers, passenger boarding bridges).\n\nParts of these machines and non-specialized moulds are also covered.\n\nThe heading excludes :\n(a) Industrial robots specialized for a specific function (e.g., painting, welding, semiconductor handling) (appropriate headings like 84.24, 85.15, 84.86).\n(b) Encapsulation machinery used in semiconductor assembly (heading 84.86)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.79 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
