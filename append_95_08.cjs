const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9508",
  "titleKo": "95.08 - 순회서커스ㆍ순회동물원 용품, 놀이공원의 탈것·워터파크 놀이기구, 유원지용 오락물(실내사격연습장용품을 포함한다), 순회극장 용품",
  "titleEn": "95.08 - Travelling circuses and travelling menageries; amusement park rides and water park amusements; fairground amusements, including travelling theatres.",
  "contentKo": "이 호에는 유원지, 테마파크, 워터파크, 순회서커스, 순회동물원, 순회극장에서 사용되는 이동식/고정식 흥행 설비, 대형 오락 기구 및 이들의 전용 부분품을 분류한다. 이 호의 설비들은 정상적인 흥행에 본질적으로 필요한 일련의 유닛으로 함께 제시되는 경우 일괄 분류된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 순회서커스와 순회동물원 용품(제9508.10호) : 이동 서커스단용 텐트, 동물 우리, 공연용 원형 무대 장치.\n- 놀이공원의 탈것 및 워터파크 놀이기구(제9508.21~29호) :\n  - 롤러코스터(roller coaster)(제9508.21호) : 상승/하강 트랙 및 특수 안전 장치가 장착된 차량 유닛.\n  - 회전놀이기구/그네/회전목마(제9508.22호) : 통제된 원형 궤도를 도는 회전목마, 대형 회전그네, 자이로드롭형 수직 낙하 기구.\n  - 범퍼카(Dodge'em car)(제9508.23호) : 바닥 전극 또는 충전 배터리로 충돌하며 운전하는 범퍼카 및 범퍼카 전용 전극 바닥판.\n  - 동작 시뮬레이터 및 무빙 씨어터(제9508.24호) : 영상/가상현실(VR)에 연동되어 플랫폼이 기계적으로 흔들리고 움직이는 4D/5D 입체 영상관 좌석 설비.\n  - 물놀이용 탈것(water ride)(제9508.25호) : 물의 순환 흐름을 타거나 미끄러져 탑승자를 이동시키는 후룸라이드, 급류 타기용 보트 및 설정된 수로 트랙.\n  - 워터파크 놀이기구(제9508.26호) : 워터 슬라이드 미끄럼틀, 스프링클러(물뿌리개), 인공분수, 조파 장치(파도 발생 기구), 레저 유수풀(lazy river), 소용돌이 풀(vortex pool) 설비.\n  - 기타(제9508.29호) : 기타 놀이공원 전용 대형 관람차, 입체 미로 등.\n- 유원지용 오락물(제9508.30호) : 사격 게임장, 코코넛 맞추기(인형 투척 게임), 룰렛형 경품 휠(운명의 수레바퀴), 거울 미로 등 영구 또는 가설 매장 내에 설치되어 운영자/기사가 딸린 오락 설비.\n- 순회극장용품(제9508.40호) : 이동 극장용 텐트, 무대막 장치, 음향 및 조명 컨트롤 콘솔 세트.\n\n[동반 분류 기준]\n- 조립식 흥행 장비와 함께 제시되는 천막(텐트), 발전기용 동력 플랜트, 전동기, 조명 기기, 무대 의자 등은 흥행에 필수적인 구성품인 경우 건물이나 차량 등 타 호로 분류하지 않고 이 호에 건물 설비와 함께 일괄 분류한다.\n- 전용 부분품(예: 회전목마용 모형 말, 워터 슬라이드 보트, 그네용 안전 로프 의자 등)은 단독 제시되어도 본 호에 분류된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단순 야외 행사용 스낵 코너, 푸드트럭, 상품 전시용 가판대 (해당 기능별 호 분류)\n(b) 유원지 부속품 수송용 트레일러 및 견인 트랙터 (제87류)\n(c) 코인/토큰/카드 지불식의 실내용 단독 오락기기 (제9504호)\n(d) 실외 오락 시설이 아닌 놀이터용 소형 미끄럼틀, 시소, 정원용 그네 (제9506호)\n(e) 사격장에서 경품이나 현상품으로 나눠주는 인형, 완구 및 경품용 잡화 (해당 완구 및 재질별 분류)" ,
  "contentEn": "This heading covers equipment and structures for travelling circuses, travelling menageries, amusement park rides (roller coasters, carousels, bumper cars, 4D simulators, water rides), water park amusements, fairground side-show games, and travelling theatres.\n\nIt includes :\n- Travelling circuses and menageries (subheading 9508.10) including circus tents and cages.\n- Roller coasters (subheading 9508.21).\n- Carousels, swings, and roundabouts (subheading 9508.22).\n- Dodge'em (bumper) cars (subheading 9508.23) and their electric floor grids.\n- Motion simulators and moving theatres (subheading 9508.24) with motion-synchronized seats.\n- Water rides (subheading 9508.25) where riders slide along a designed water track.\n- Water park amusements (subheading 9508.26) including water slides, splash pads, wave generators, lazy rivers, and vortex pools.\n- Other rides (subheading 9508.29) including giant Ferris wheels.\n- Fairground amusements (subheading 9508.30) including shooting galleries, coconut shies, and wheel-of-fortune stands.\n- Travelling theatres (subheading 9508.40).\n\nExcludes standard coin-operated arcade machines (heading 95.04), transport trucks/trailers (Chapter 87), and goods distributed as prizes."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 95.08 to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
