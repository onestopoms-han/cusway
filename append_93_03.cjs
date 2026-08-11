const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9303",
  "titleKo": "93.03 - 그 밖의 화기와 폭약으로 점화되는 이와 유사한 장치[예: 경기용 산탄총과 라이플(rifle), 총구장전 화기, 베리식 피스톨(Very pistol), 신호용 화염만을 발생하는 그 밖의 장치, 공포탄용 피스톨(pistol)ㆍ리볼버(revolver), 캡티브볼트(captive-bolt)형 무통(無痛) 도살기, 줄 발사총(line-throwing gun)]",
  "titleEn": "93.03 - Other firearms and similar devices which operate by the firing of an explosive charge (for example, sporting shotguns and rifles, muzzle-loading firearms, Very pistols and other devices designed to project only signal flares, pistols and revolvers for firing blank ammunition, captive-bolt humane killers, line-throwing guns).",
  "contentKo": "이 호에는 군용 무기(9301호) 및 휴대용 권총(9302호)을 제외한 모든 화기(firearms)와, 화기가 아니더라도 화약/폭약의 폭발을 동력원으로 삼아 작동하는 각종 발사 및 도살 장치를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 총구장전 화기(제9303.10호) : 현대식 탄약통(탄창)을 격발하지 못하고, 총구로 화약과 탄환을 다져 넣는 구식 흑색화약총(머즐로더 muzzle-loader).\n- 스포츠용/수렵용/표적사격용 산탄총(제9303.20호) : 클레이 사격 등 표적 사격용, 조류/야생동물 수렵용 활강총(산탄과 라이플 총열 결합식 및 교체식 총열 포함, 펀트총 punt gun 포함).\n- 스포츠용/수렵용/표적사격용 라이플(rifle)(제9303.30호) : 단발식, 연발식 또는 반자동식 경기용 소총.\n- 기타(제9303.90호) :\n  - 신호 발사용 베리 피스톨(Very pistol) 및 기타 신호탄 권총.\n  - 공포탄 발사용 권총/스타팅 피스톨(종종 크로노미터 연동 전기장치가 있는 것), 무대 소도구용 공포탄 총.\n  - 캡티브볼트(captive-bolt)형 무통 도살기(도축용 볼트 발사 총, 볼트가 이탈하지 않고 후퇴 재사용되는 구조).\n  - 구난 및 통신 개설용 줄 발사총(line-throwing gun).\n  - 포경포(harpoon gun, 바다 생물 포획용 작살총).\n  - 침입자 경고용 공포탄 발사기, 살우경보용 우박포(hail cannon).\n  - 지팡이형 위장 경기용 산탄총.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 리벳팅, 벽공 충전 등에 사용하는 공업용 화약 작동식 네일러/공구 (제8205호)\n(b) 동물의 살상용으로 사용하는 일반 실탄 발사 권총 (제9302호)" ,
  "contentEn": "This heading covers all firearms other than military weapons of heading 93.01 and handguns of heading 93.02, as well as devices which are not weapons but operate by the firing of an explosive charge.\n\nIt includes :\n- Muzzle-loading firearms (subheading 9303.10) using black powder.\n- Sporting, hunting, and target-shooting shotguns (subheading 9303.20) including punt guns.\n- Sporting, hunting, and target-shooting rifles (subheading 9303.30).\n- Other devices (subheading 9303.90) including Very pistols (flares), starting/blank-firing pistols, captive-bolt humane killers, line-throwing guns, harpoon guns, blank-firing warning cannons, and hail cannons.\n\nExcludes powder-actuated riveting tools (heading 82.05) and bullet-firing pistols used for slaughtering (heading 93.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.03 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
