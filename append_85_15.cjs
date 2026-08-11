const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8515",
  "titleKo": "85.15 - 전기식(전기발열에 따른 가스식을 포함한다)ㆍ레이저나 그 밖의 광선식ㆍ광자빔식ㆍ초음파식ㆍ전자빔식ㆍ자기펄스(magnetic pulse)식ㆍ플라즈마 아크(plasma arc)식 납땜용ㆍ땜질용이나 용접용 기기(절단 기능이 있는지에 상관없다), 금속이나 서멧(cermet)의 가열분사용 전기식 기기",
  "titleEn": "85.15 - Electric (including electrically heated gas), laser or other light or photon beam, ultrasonic, electron beam, magnetic pulse or plasma arc soldering, brazing or welding machines and apparatus, whether or not capable of cutting; electric machines and apparatus for hot spraying of metals or cermets.",
  "contentKo": "이 호에는 금속, 플라스틱 등의 납땜용, 땜질용, 용접용 기기(절단 겸용 포함) 및 가열 금속 분사기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(I) 납땜용, 땜질용, 용접용 기기\n(A) 납땜용(soldering) 및 땜질용(brazing) 기기 : 저용융점의 용가재를 전열, 유도로 녹여 접합하는 기기 (전열식 납땜인두, 납땜건, 전용 용접심선 공급 장치 등).\n(B) 금속의 저항용접기 : 주울열(저항열)과 가압을 이용한 무용가재 접합기 (바트 용접기, 스폿 용접기, 프로젝션 용접기, 시임 용접기 등).\n(C) 금속의 아크 및 플라즈마 아크 용접기 (절단 겸용 포함) : 피복전극 아크 용접기, 가스실드 아크 용접기(MIG, MAG, TIG), 서브머지드 아크 용접기, 플라즈마 아크 용접기(플라즈마 제트용).\n(D) 유도식 금속 용접기.\n(E) 전자빔식 용접기 (진공 상태에서 전자 충돌열 이용, 절단 겸용 포함).\n(F) 진공확산 용접기 : 진공조, 진공펌프, 가열/가압 장치로 구성된 확산접합기.\n(G) 광자빔식 용접기 : 레이저빔식 용접기(간섭성 단색광 이용), 라이트빔식 용접기(비간섭성 집속광 이용).\n(H) 열가소성 재료(플라스틱) 용접기 : 열가스 용접기, 가열엘레멘트 용접기, 고주파 용접기(유전손실 이용).\n(IJ) 초음파식 용접기 : 초음파 진동을 이용하여 이종 금속, 금속 박박, 플라스틱 필름 등을 융착하는 기기.\n용접 작업을 위해 특별히 설계된 용접용 로봇을 포함한다.\n\n(II) 금속이나 서멧(cermet)의 가열분사용 전기식 기기\n전기아크로 금속/서멧을 녹이고 압축공기로 분사 피복하는 기기.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품(납땜/용접헤드, 토치 포인트, 전극홀더, 롤러/조오 등 접촉전극)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전기용접장치를 갖춘 포장기계 (제8422호)\n(b) 의류 퓨징프레스 (제8451호)\n(c) 레이저/전자빔식 금속 절단 전용 기계 (제8456호)\n(d) 마찰용접기 (제8468호)\n(e) 반도체 조립용 납땜/용접기 (제8486호)\n(f) 소모성 용접봉/전극 (재질에 따라 분류 또는 제8311호)\n(g) 탄소/흑연 전극 (제8545호)\n(h) 단순 금속분사 피스톨 단독 제시품 (제8424호)",
  "contentEn": "This heading covers machines and apparatus for soldering, brazing or welding (whether or not capable of cutting), and electric hot spraying equipment for metals or cermets.\n\nIt includes :\n(I) Soldering, brazing and welding equipment :\n- Soldering and brazing tools (electric soldering irons, soldering guns, wire feed attachments).\n- Resistance welding machines (butt, flash, spot, multi-spot, projection, seam, and high-frequency resistance welding).\n- Arc and plasma arc welding/cutting machines (shielded metal arc, MIG, MAG, TIG, submerged arc, and plasma jet tools).\n- Induction welding machines.\n- Electron beam and vacuum diffusion welding machines.\n- Photon beam welding machines (laser beam and light beam welding).\n- Thermoplastic welding machines (hot gas, heating element, and high-frequency dielectric loss plastic welders).\n- Ultrasonic welding machines (for foils, dissimilar metals, or plastics).\n- Industrial robots specially designed for welding.\n(II) Hot spraying machines for metals or cermets (arc-spraying systems using compressed air).\n\nParts of these machines are also classified here, including torch points, welding heads, tongs, electrode holders, and contact rollers.\n\nThe heading excludes :\n(a) Packaging machines with integrated welding units (heading 84.22).\n(b) Fusing presses (heading 84.51).\n(c) Dedicated laser/electron-beam cutting machines (heading 84.56).\n(d) Friction welding machines (heading 84.68).\n(e) Soldering/welding apparatus specialized for semiconductor assembly (heading 84.86).\n(f) Consumable metal electrodes or welding rods (classified by material or heading 83.11).\n(g) Carbon/graphite electrodes (heading 85.45).\n(h) Metal-spraying pistols presented separately (heading 84.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.15 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
