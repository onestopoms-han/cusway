const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9015",
  "titleKo": "90.15 - 토지측량기기(사진측량용을 포함한다)ㆍ수로측량기기ㆍ해양측량기기ㆍ수리계측기기ㆍ기상관측기기ㆍ지구물리학용 기기[컴퍼스(compass)는 제외한다]ㆍ거리측정기",
  "titleEn": "90.15 - Surveying (including photogrammetrical surveying), hydrographic, oceanographic, hydrological, meteorological or geophysical instruments and appliances, excluding compasses; rangefinders.",
  "contentKo": "이 호에는 지형도/수로도 작성을 위한 국토 측량, 수준 측량, 해양/수로 관측, 수리 계측, 기상 관측, 지구물리학적 광구/지진 탐사 등에 사용되는 전용 계측 기기 및 거리측정기(rangefinder)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 거리측정기(rangefinder)(제9015.10호) : 측량, 사진 촬영, 군사용 광학/광전자식 거리측정기.\n- 경위의(theodolite)와 시거의(tachymeter)(제9015.20호) : 광학/광전자식 경위의, 자이로 경위의, 시거의(타코미터), 컴퍼스-경사계, 포술용 조준경사계.\n- 수준기(water level)(제9015.30호) : 광학식/망원경식 수준기, 자동조정 수준기, 레이저 수준기(기포식 수준기는 제외).\n- 사진측량기기(photogrammetrical)(제9015.40호) : 항공사진의 축척 오차를 정립 수정하는 왜곡보정 투영기(restitution apparatus), 스테레오 제도기(stereoplotter, 스테레오토포그래프, 스테레오플래니그래프), 분석 입체측정 시스템(analytical stereomeasuring system).\n- 그 밖의 기기(측량, 수로, 기상, 지구물리)(제9015.80호) :\n  - 측량/수로용 : 조준의(alidade), 광구(optical square), 경사계(clinometer), 척량사슬(land chain), 수준표척, 광조용 헬리오스타트.\n  - 수리/해양용 : 부표식 수위 자동기록계, 버킷휠/패들휠식 하천 유속계, 파도/조류 기록계.\n  - 기상관측용 : 풍향계, 풍속계(anemometer, 컵형/차압식/발전기식), 우량계, 증발계, 일사기록장치, 측운기, 실로미터(구름 높이 측정기), 시정계(visibility meter), 라디오존데(radio-sonde) 고층기상탐측기.\n  - 지구물리학용 : 지진계(seismograph), 광유/석유 탐사용 자기저울/중력계/토션 밸런스, 프로톤 자력계(magnetometer), 시추공 스캐닝 및 기울기 측정기.\n- 부분품과 부속품(제9015.90호) : 수준측량사슬용 핀, 전용 케이스, 마운팅 가대 등(단, 삼각대는 제외).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 위성위치추적시스템(GPS) 수신기 (제8526호)\n(b) 기포식 수준기(air bubble level) 및 다림줄(plumb-line) (제9031호)\n(c) 공작기용 스틸 줄자 및 일반 길이 측정 밴드 (제9017호)\n(d) 온도계, 기압계, 습도계 및 이들의 기록계 (제9025호)\n(e) 공업용 액면계, 유량계 및 갱내 통기속도계 (제9026호)\n(f) 지구물리용 저항 측정기, 열전쌍 및 방사능 검출기(가이거 계수기) (제9030호)\n(g) 항공사진 촬영용 항공 카메라 (제9006호)\n(h) 삼각대, 일각대, 삼각 마운트 (제9620호)\n(ij) 선박 항해용 크로노미터 (제91류)\n(k) 가구 또는 천문대용 돔 철강 구조물 (제15부)" ,
  "contentEn": "This heading covers surveying (including photogrammetrical), hydrographic, oceanographic, hydrological, meteorological, or geophysical instruments, excluding compasses of heading 90.14. It also covers rangefinders.\n\nIt includes :\n- Rangefinders (subheading 9015.10) for surveying, photography, or military purposes.\n- Theodolites and tachymeters (subheading 9015.20) including optical/electronic theodolites, gyrotheodolites, and transit instruments.\n- Levelling instruments (subheading 9015.30) including optical, autoset, and laser levels.\n- Photogrammetrical surveying instruments (subheading 9015.40) including stereoplotters, stereoplanigraphs, and analytical stereomeasuring systems.\n- Other instruments (subheading 9015.80) including alidades, clinometers, surveying chains/rods, river flowmeters (current meters), anemometers, ceilometers, rain gauges, seismographs, gravimeters, magnetometers, and radio-sondes.\n- Parts and accessories (subheading 9015.90).\n\nExcludes bubble levels (heading 90.31), GPS receivers (heading 85.26), thermometers, barometers and hygrometers (heading 90.25), industrial flowmeters/level gauges (heading 90.26), Geiger counters (heading 90.30), aerial cameras (heading 90.06), and tripods (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.15 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
