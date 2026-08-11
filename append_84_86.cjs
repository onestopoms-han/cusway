const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8486",
  "titleKo": "84.86 - 반도체 보울(boule)이나 웨이퍼(wafer)ㆍ반도체디바이스ㆍ전자집적회로ㆍ평판디스플레이의 제조에 전용되거나 주로 사용되는 기계와 기기, 이 류의 주 제11호다목에서 특정한 기계와 기기, 그 부분품과 부속품",
  "titleEn": "84.86 - Machines and apparatus of a kind used solely or principally for the manufacture of semiconductor boules or wafers, semiconductor devices, electronic integrated circuits or flat panel displays; machines and apparatus specified in Note 11 (C) to this Chapter; parts and accessories.",
  "contentKo": "이 호에는 반도체 보울이나 웨이퍼, 반도체 디바이스, 전자집적회로, 평판디스플레이의 제조에 전용되거나 주로 사용하는 기계와 장치를 분류한다. 단, 측정, 검사, 화학분석용 기기는 제90류로 제외한다.\n\n이 호에는 다음의 것을 포함한다.\n\n(A) 보울(boule)이나 웨이퍼(wafer) 제조용 기계와 기기\n(1) 단결정 성장로, 실리콘 정제용 존멜팅(zone melting)로, 산화로, 확산로\n(2) 결정 성장기 및 결정 인상장치(puller)\n(3) 보울 연마기 및 그라인더\n(4) 웨이퍼 절단용 톱기계(slicing saw)\n(5) 웨이퍼 연마기(grinder), 래퍼(lapper), 광택기(polisher)\n(6) 화학적ㆍ기계적 광택기(CMP)\n\n(B) 반도체디바이스나 전자집적회로 제조용 기계와 기기\n(1) 막 형성 장비 (CVD, PVD, 스퍼터링, 에피택시 MBE 장비, 산화로 등)\n(2) 도핑 장비 (열확산 장비, 이온주입기, 소둔로)\n(3) 식각 및 감광액 박리(ash/strip) 장비 (습식/건식 플라즈마 식각기, 이온 빔 밀링기)\n(4) 리소그래피 노광 장비 (감광액 스피너/도포기, 밀착/근접/스캐닝/스테퍼 노광기, E-빔/레이저 직접 묘화기)\n(5) 현상기(developer), 스크린 프린터, 웨이퍼 다이싱용 레이저 스크라이버 및 다이싱 쏘(dicing saw)\n\n(C) 평판디스플레이 제조용 기계와 기기\n평판 기판 제조용 식각, 현상, 세척, 노광, 감광제 도포(스피너), 도핑용 이온주입기, 열처리 오븐, CVD/PVD 증착기, 절단/스크라이빙기 등.\n\n(D) 이 류의 주 제11호다목 특정 기계와 기기\n(1) 마스크/레티클 제조 및 수리용 기기 (포토플로터, 이온밀링기 등)\n(2) 반도체 조립/패키징 기기 (레이저 마킹기, 캡슐화 몰딩 프레스, 와이어 본더, 웨이퍼 범핑 장비)\n(3) 보울, 웨이퍼, 디스플레이 기판 이송/취급/하역용 자동 로봇 및 하역 장비\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 부속품(전용 툴홀더 및 특수 부착물 포함)도 이 호에 분류한다.",
  "contentEn": "This heading covers machines and apparatus of a kind used solely or principally for the manufacture of semiconductor boules or wafers, semiconductor devices, electronic integrated circuits or flat panel displays, as well as machines and apparatus specified in Note 11 (C) to this Chapter.\n\nIt includes :\n(I) Boule or wafer manufacturing equipment (crystal pullers, slicing saws, wafer grinders, lappers, CMP tools).\n(II) Semiconductor device and IC fabrication machinery (CVD, PVD, sputtering, MBE, ion implanters, annealing furnaces, wet/dry plasma etchers, ashers, photoresist spinners, aligners, steppers, direct write lithography, developers, dicing saws).\n(III) Flat panel display manufacturing machinery.\n(IV) Mask/reticle making equipment, semiconductor assembly tools (wire bonders, packaging molding presses, laser markers, wafer bumping equipment, automatic wafer handling robots).\n\nParts and accessories (including work/tool holders and specialized attachments) are also covered.\n\nThe heading excludes :\n(a) Measuring, checking or chemical analysis instruments (Chapter 90)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.86 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
