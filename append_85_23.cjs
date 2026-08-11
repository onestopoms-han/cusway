const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8523",
  "titleKo": "85.23 - 디스크ㆍ테이프ㆍ솔리드 스테이트(solid-state)의 비휘발성 기억장치ㆍ스마트카드와 음성이나 그 밖의 현상의 기록용 기타 매체[기록된 것인지에 상관없으며 디스크 제조용 매트릭스(matrices)와 마스터(master)를 포함하되, 제37류의 물품은 제외한다]",
  "titleEn": "85.23 - Discs, tapes, solid-state non-volatile storage devices, \"smart cards\" and other media for the recording of sound or of other phenomena, whether or not recorded, including matrices and masters for the production of discs, but excluding products of Chapter 37.",
  "contentKo": "이 호에는 음성이나 기타 현상(데이터, 소프트웨어, 영상 등)을 수록/기록하기 위한 각종 매체(기록 여부 불문) 및 디스크 대량 복제용 매트릭스/마스터를 분류한다.\n\n이 호에는 다음의 매체들을 포함한다.\n(A) 자기식 매체(magnetic media)\n- 플라스틱/금속/종이 재질에 자성체를 입힌 것.\n- 오디오/비디오 카세트테이프 (VHS, Hi-8, 미니-DV 등).\n- 컴퓨터용 디스켓(플로피디스크), 자기테이프.\n- 마그네틱 스트라이프(magnetic stripe) 카드 (신용카드, 교통카드 등 자기띠 부착 카드).\n(B) 광학식 매체(optical media)\n- 유리/플라스틱에 광반사층을 형성하여 레이저로 읽고 쓰는 디스크 (기록 유무 불문, 재기록형 포함).\n- CD(CD-ROM, CD-R, CD-RW), DVD, 블루레이 디스크.\n- 자기광학(magneto-optical) 디스크 (MO 디스크).\n(C) 반도체 매체(semiconductor media)\n- 솔리드 스테이트(solid-state) 비휘발성 기억장치 : 배터리 없이 전원을 공급받아 작동하는 플래시 메모리 카드, SD 카드, CF 카드, USB 플래시 드라이브(USB 메모리).\n- 스마트카드(smart card) : 마이크로프로세서, RAM, ROM 칩을 내장한 카드. NFC/RFID 등을 지원하는 프록시미티(Proximity) 카드 및 스마트 태그(tag) 포함 (단, 다른 능동/수동 회로소자를 포함하지 않는 것에 한정).\n(D) 기타 매체 : 아날로그 축음기용 레코드판(LP판).\n\n디스크 제조용 마스터/매트릭스 : 마스터 디스크, 머더 디스크, 스탬퍼 등을 포함한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 사운드트랙을 지닌 감광성/영화용 필름 (제37류)\n(b) 천공식 종이테이프 및 펀치카드 (제48류)\n(c) 자성 물질을 도포하지 않은 플라스틱 필름/종이 테이프 (제39류, 제48류 등)\n(d) 인쇄회로 기판에 메모리 칩을 장착한 SIMM, DIMM 등 메모리 모듈 (제8548호 또는 제16부 주 제2호)\n(e) 비디오 게임기용 롬 카트리지 (제9504호)",
  "contentEn": "This heading covers various media for the recording of sound or other phenomena (data, software, images, etc.), whether or not recorded, and matrices and masters for reproducing discs.\n\nIt includes :\n(I) Magnetic media :\n- Audio/video cassette tapes (VHS, Hi-8, Mini-DV).\n- Computer diskettes and magnetic tapes.\n- Cards incorporating a magnetic stripe (whether or not recorded).\n(II) Optical media :\n- Compact discs (CD, CD-ROM, CD-RW) and Digital Versatile Discs (DVD, Blu-ray).\n- Magneto-optical (MO) discs.\n(III) Semiconductor media :\n- Solid-state non-volatile storage devices (flash memory cards, SD cards, CF cards, USB flash drives).\n- Smart cards : Cards incorporating one or more electronic integrated circuits (microprocessor, RAM, ROM). It includes proximity cards and electronic tags (RFID) complying with Chapter Note 6 (b).\n(IV) Other media : Gramophone records (grooved LP records).\n- Matrices and masters (master discs, mother discs, stampers) for replicating optical discs.\n\nThe heading excludes :\n(a) Photographic or cinematographic films containing sound tracks (Chapter 37).\n(b) Paper tapes or punch-cards recorded by perforation (Chapter 48).\n(c) Media blank raw materials (plastics in Chapter 39, paper in Chapter 48, etc.).\n(d) Electronic memory modules such as SIMMs and DIMMs (Section XVI Note 2).\n(e) Game cartridges for video game consoles (heading 95.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.23 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
