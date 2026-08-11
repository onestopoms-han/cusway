const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8541",
  "titleKo": "85.41 - 반도체 디바이스(예: 다이오드ㆍ트랜지스터ㆍ반도체 기반 트랜스듀서), 감광성 반도체 디바이스(광전지는 모듈에 조립되었거나 패널로 구성되었는지 여부와 관계없이 포함한다), 발광다이오드[(엘이디), 다른 발광다이오드와 결합되었는지 여부과 관계없이 포함한다], 장착된 압전기 결정소자(+)",
  "titleEn": "85.41 - Semiconductor devices (for example, diodes, transistors, semiconductor-based transducers); photosensitive semiconductor devices, including photovoltaic cells whether or not assembled in modules or made up into panels; light-emitting diodes (LED), whether or not combined with other light-emitting diodes (LED); mounted piezo-electric crystals.",
  "contentKo": "이 호에는 주 제12호가목 1)에 따라 개별 반도체 디바이스(다이오드, 트랜지스터 등), 반도체 기반 트랜스듀서(MEMS 센서/액추에이터 등), 감광성 반도체 디바이스(포토다이오드, 태양전지 등), 발광다이오드(LED) 및 장착된 압전기 결정소자를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 일반 반도체 디바이스\n(1) 다이오드(diode) : p-n 접합을 갖고 전류를 단방향으로 흐르게 하는 소자 (신호용, 정류용, 제너 다이오드 등. 단 LED 및 감광성 다이오드 제외).\n(2) 트랜지스터(transistor) : 3단자 또는 4단자 증폭/스위칭 소자 (바이폴라 트랜지스터, 전계효과트랜지스터(FET/MOSFET), 절연 게이트 바이폴라 트랜지스터(IGBT) 등).\n(3) 사이리스터, 다이액, 트라이액 : 전력 제어용 반도체 스위칭 소자.\n(B) 반도체 기반 트랜스듀서 (Semiconductor-based Transducer)\n- 반도체 기판을 마이크로 머시닝(MEMS) 가공하여 물리적/화학적 현상을 전기신호로 변환하거나 그 반대로 변환하는 소자.\n- 반도체 기반 센서 (예: 실리콘 MEMS 마이크 센서 소자, 가스 센서 등).\n- 반도체 기반 액추에이터 (예: 광 스위칭/LIDAR용 MEMS 마이크로 미러 등).\n- 반도체 기반 공진기(예: RF FBAR 필터용 공진기) 및 오실레이터.\n(C) 감광성 반도체 디바이스\n- 광전도 셀 (CdS 등 광의존저항기 LDR).\n- 포토다이오드, 포토트랜지스터, 포토사이리스터, 포토커플러(포토커플러 패키지), 포토릴레이.\n- 광전지 및 태양전지(Solar Cell) : 모듈이나 패널에 조립된 것도 포함 (단, 모터나 바이패스 다이오드 이상의 능동 제어 회로가 장착된 발전 모듈/패널은 제8501호로 제외).\n(D) 발광다이오드(LED)\n- 개별 LED 소자, LED 패키지(보호용 제너다이오드 내장형 및 인광체 결합형 백색 LED 패키지 포함), 구동 컨트롤 회로가 포함되지 않은 LED 조립품(LED PCB 바 등).\n- 레이저 다이오드(laser diode).\n(E) 장착된 압전기 결정소자\n- 수정(quartz), 티탄산바륨 등 압전 효과를 갖는 결정에 최소한 전극/전선 단자를 장착하여 용기 등에 넣은 소자 (필터, 공진기용 단독 압전 소자).\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 미가공 실리콘/게르마늄 단결정 웨이퍼 및 도프 처리된 웨이퍼 (제3818호)\n(b) 모노리식 집적회로(IC) 및 주 제12호나목 4)의 MCO 등 복합부품 집적회로 (제8542호)\n(c) LED 램프 및 전용 전력 조절 회로가 내장된 LED 모듈 (제8539호)\n(d) 압전 결정 소자가 내장된 완성품 마이크/스피커 (제8518호) 또는 시계용 쿼츠 오실레이터 완제품 (제9114호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.41 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
