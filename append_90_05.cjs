const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9005",
  "titleKo": "90.05 - 쌍안경ㆍ단안경ㆍ그 밖의 광학식 망원경과 이들의 장착구, 그 밖의 천체관측용 기기와 그 장착구(전파관측용 기기는 제외한다)",
  "titleEn": "90.05 - Binoculars, monoculars, other optical telescopes, and mountings therefor; other astronomical instruments and mountings therefor, but not including instruments for radio-astronomy.",
  "contentKo": "이 호에는 휴대용/탁상용 쌍안경, 단안경, 기타 광학식 망원경(굴절식 및 반사식)과 이들의 거치용 장착구, 그리고 기타 천체 관측용 기기(자오의, 적도의, 쇄일로스타트 등) 및 전용 부속품을 분류한다. 단, 전파천문학용 전파망원경은 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 쌍안경(binocular)(제9005.10호) : 오페라 글라스, 여행/수렵용 쌍안경, 군용 야간 쌍안경 및 잠망경식 쌍안경.\n- 그 밖의 기기(망원경 및 천체관측기기)(제9005.80호) :\n  - 단안경 및 굴절/반사식 지상 망원경(동전 주입식 풍경 관측용 망원경 포함).\n  - 천체 굴절망원경(refracting telescope) 및 반사망원경(reflecting telescope)(쉬미트 카메라/쉬미트 반사망원경 포함).\n  - 광전자 배증관이나 영상 변환관(영상 증강장치 image intensifier)이 결합된 야간 전투용 적외선 망원경/쌍안경.\n  - 자오의(transit instrument), 적도의(equatorial telescope), 천정의(zenith telescope), 경위의(altazimuth).\n  - 척경회전의(coelostat), 일광반사장치(heliostat, 천체용), 태양경(siderostat).\n  - 단광태양사진의(spectroheliograph), 태양분광기(spectroheliscope), 태양의(heliometer), 광관의(coronograph).\n- 부분품과 부속품(장착구 포함)(제9005.90호) : 삼각대/거치대 등 전용 장착구, 마이크로미터(filar micrometer), 회전 구동용 게리쉬 드라이브(Gerrish drive), 경동(tube), 하우징.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전파천문학용 전파망원경(안테나 및 수신기 설비 등) (제8525호, 제8527호 또는 제9030호)\n(b) 무기용 망원조준경, 잠수함/전차용 잠망경, 제도/측량기기용 망원경(세오돌라이트/수준기 부착용) (제9013호 - 주 제4호 적용)\n(c) 측량용 세오돌라이트 및 지상용 일광반사장치 (제9015호)\n(d) 미장착 상태의 반사경 거울, 대물렌즈, 프리즘 (제9001호 또는 제9002호)\n(e) 항행용 육분의(sextant) (제9014호)\n(f) 천문대용 돔(dome) 및 관측 플랫폼 철강 구조물 (제7308호 등)\n(g) 분광사진용 측미농도계 (제9027호)\n(h) 천문시계 (제91류)\n(ij) 도어 뷰어(door eye) (제9013호)\n(k) 섬광 현미경(blink microscope) (제9011호)" ,
  "contentEn": "This heading covers binoculars, monoculars, optical telescopes (refracting and reflecting), and other astronomical instruments (excluding radio-astronomy instruments), and their mountings.\n\nIt includes :\n- Binoculars (subheading 9005.10) including opera glasses, military night binoculars, and prism binoculars.\n- Other instruments (subheading 9005.80) including refracting and reflecting astronomical telescopes, terrestrial telescopes (including coin-operated scenic telescopes), transit instruments, equatorial telescopes, coelostats (including astronomical heliostats/siderostats), spectroheliographs, spectroheliscopes, heliometers, and coronographs.\n- Infrared/image-intensifier night-vision binoculars or telescopes.\n- Parts and accessories (subheading 9005.90) including tripod stands, filar micrometers, Gerrish drives, and optical tubes.\n\nExcludes radio telescopes (heading 85.25 or 90.30), telescopic sights for weapons, periscopes for tanks/submarines, and telescopes for other measuring instruments like theodolites (heading 90.13 per Chapter Note 4), land-surveying theodolites and geodetic heliostats (heading 90.15), unmounted optical lenses/mirrors (heading 90.01 or 90.02), sextants (heading 90.14), observatory domes (Section XV), blink microscopes (heading 90.11), and astronomical clocks (Chapter 91)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.05 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
