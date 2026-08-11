const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9503",
  "titleKo": "95.03 - 세발자전거ㆍ스쿠터ㆍ페달 자동차와 이와 유사한 바퀴가 달린 완구, 인형용 차, 인형과 그 밖의 완구, 축소 모형과 이와 유사한 오락용 모형(작동하는 것인지에 상관없다), 각종 퍼즐",
  "titleEn": "95.03 - Tricycles, scooters, pedal cars and similar wheeled toys; dolls' carriages; dolls; other toys; reduced-size (“scale”) models and similar recreational models, working or not; puzzles of all kinds.",
  "contentKo": "이 호에는 어린이용 세발자전거, 킥스쿠터, 페달 구동 차량, 인형(doll) 및 인형용 유모차, 축소 모형(조립식 프라모델 및 완구용 기차/비행기 포함), 그리고 모든 종류의 지능형 퍼즐(큐브, 퍼즐판)을 포함하여 사람(어린이 및 성인)의 오락을 목표로 설계된 일체의 완구류(toys)와 그 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 바퀴 달린 완구(A) : 세발자전거, 두발/세발 킥스쿠터(높이 조절 유무 불문, 발로 땅을 밀어 타는 스쿠터 포함), 소형 페달 자동차(지프, 스포츠카 형상), 모터가 내장되어 어린이가 직접 운전할 수 있는 완구용 차.\n- 인형용 차(B) : 인형용 접이식 유모차(stroller), 스트롤러용 전용 베개/침구류.\n- 인형(C) : 아기 인형, 캐릭터 인형, 장식용 마스코트 인형, 꼭두각시 인형극용 인형(플라스틱, 도자기, 직물 등 재질 불문, 말소리나 관절 작동 장치 내장 여부 불문) 및 전용 부분품(가발, 인형옷, 신발, 눈 작동 기구, 안구 단독-단, 미장착 유리 안구는 제외).\n- 그 밖의 완구(D) :\n  - 로봇, 우주 괴물, 천사 등 비인간형 모형 완구.\n  - 완구용 권총/총(물총, 고무줄총 포함).\n  - 조립식 블록 완구(레고 등 조립 세트, 빌딩 블록).\n  - 바퀴가 달린 것 외의 탈것(어린이용 목마 등).\n  - 완구용 모터 및 완구용 증기기관, 장난감 연(kite) 및 풍선.\n  - 완구용 스포츠 기구(미니 골프/테니스/당구 세트, 야구 배트 등).\n  - 완구용 공구 세트(의사 놀이, 목공 놀이 세트 등), 어린이용 모형 안경.\n  - 완구용 악기(장난감 피아노, 트럼펫, 드럼, 하모니카 등 - 단 실용성 성능이 극히 제한되고 크기가 작은 것에 한함).\n  - 교육용 과학 실험 세트(화학 세트, 완구용 인쇄기, 편물 세트).\n  - 완구용 그림책(절단/조립 모형용, 입체 팝업북 포함).\n  - 완구용 구슬(마블 유리구슬), 완구용 동전 저금통, 유아용 딸랑이, 깜짝 상자(jack-in-the-box).\n  - 유아 및 어린이용 장난감 텐트(실내외 놀이용).\n- 축소 모형 및 오락용 모형(E) : 무선조종(RC) 비행기, 헬기, 보트, 기차 모형(스케일 모델 키트 프라모델 포함).\n- 퍼즐(F) : 루빅스 큐브, 평면 퍼즐판, 입체 조각 맞추기 등 모든 퍼즐.\n- 완구 세트 및 판촉 결합팩(주 제4호 요건) : 완구 외의 경미한 품목(소량의 사탕, 스티커 등)과 완구가 함께 세트로 포장되어 완구의 본질적 특성을 유지하는 소매용 조합 세트.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전적으로 애완동물(개, 고양이 등)의 놀이용으로 설계된 동물용 장난감 (재질에 따라 4016호, 6307호 등 각 호에 분류 - 주 제5호)\n(b) 어린이용 이륜 자전거 (제8712호) 및 성인 오락용 무인항공기(드론) (제8806호)\n(c) 어린이용 스케치북, 수채화 그림책 (제4903호) 및 문구용 크레용, 파스텔 (제9609호)\n(d) 카니발/축제용 가면, 모형 코(코스프레용), 부풀리는 종이 나팔 (제9505호)\n(e) 동반 제시되지 않는 순수 슬로트 레이싱 트랙 세트 및 카드 게임용 카드 (제9504호)\n(f) 장식 가판대용 쇼윈도 마네킹 (제9618호)\n(g) 인형이 단순 결합된 작동형 괘종 오르골 (제9208호)" ,
  "contentEn": "This heading covers wheeled toys designed to be ridden by children (e.g. tricycles, scooters, pedal cars), dolls' carriages, dolls, other toys, scale models, and puzzles of all kinds.\n\nIt includes :\n- Wheeled toys (A) including tricycles, kick scooters, pedal cars, and battery-powered kids' cars.\n- Dolls' carriages (B) including strollers.\n- Dolls (C) representing humans (made of plastics, ceramics, textiles) and their clothing/accessories.\n- Other toys (D) including robots, toy guns, building blocks (Lego), rocking horses, toy musical instruments (with limited musical capacity), toy tools, educational sets (chemistry kits), play tents, and toy marbles.\n- Scale models (E) including working or non-working hobby kits (RC airplanes/trains).\n- Puzzles (F) including Rubik's cubes and jigsaw puzzles.\n- Toy sets containing minor items (sweets/stickers) that maintain the character of a toy (Note 4).\n\nExcludes pet toys (Note 5), children's two-wheeled bicycles (heading 87.12), unmanned drones (heading 88.06), painting books (heading 49.03), and carnival masks (heading 95.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 95.03 to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
