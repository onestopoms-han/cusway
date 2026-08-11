const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9507",
  "titleKo": "95.07 - 낚싯대ㆍ낚싯바늘과 그 밖의 낚시용구, 낚시용 망ㆍ포충망(捕蟲網)과 이와 유사한 망, 조류 유인용구(제9208호나 제9705호의 것은 제외한다)와 이와 유사한 수렵용구",
  "titleEn": "95.07 - Fishing rods, fish-hooks and other line fishing tackle; fish landing nets, butterfly nets and similar nets; decoy “birds” (other than those of heading 92.08 or 97.05) and similar hunting requisites.",
  "contentKo": "이 호에는 레저 및 스포츠 낚시용 전용 용구(낚싯대, 릴, 바늘, 인조 미끼, 찌 등), 들망/잠대망(어망), 포충망(잠자리채) 및 수렵용 조류 모형(데코이 버드) 등을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 낚싯대(제9507.10호) : 대나무, 목재, 금속, 유리섬유, 플라스틱(카본 파이버 포함) 재질의 단일식 또는 조립 조인트식 낚싯대.\n- 낚싯바늘(제9507.20호) : 외바늘, 세발바늘 등 모든 형태/크기의 스틸/청동/도금 낚싯바늘(짧은 목줄에 연결된 상태의 바늘 포함).\n- 낚시 릴(reel)(제9507.30호) : 스피닝 릴, 베이트 릴, 전동 릴(소형 모터 내장형).\n- 기타(제9507.90호) :\n  - 인조 미끼(인조 파리, 모조 물고기/곤충/벌레 등 베이트) 및 미끼가 결합된 낚싯바늘, 스피너(spinning bait).\n  - 완성 가공된 낚싯줄(낚싯바늘/찌가 결합된 완성 상태의 라인), 찌(코르크, 유리, 깃촉 재질, 형광 찌 포함), 봉돌(싱커 sinker), 낚싯줄 감는 줄판.\n  - 낚싯대 부착용 가이드 링(단, 보석 링 제외), 낚싯대 끝 부착용 입질 경보 벨(집게/클립 등에 장착된 전용 벨).\n  - 자동 챔질 장치(물고기가 물면 자동으로 당겨지는 기구).\n  - 어망(뜰망, fish landing nets), 나비채(포충망 butterfly nets).\n  - 수렵용 조류 유인 모형(모형새 decoy birds) 및 사냥용 라크미러(lark mirror, 햇빛 반사 거울).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 모조 미끼(인조 파리) 제작용 생깃털 (제0505호 또는 제6701호)\n(b) 단순 절단은 되었으나 낚싯바늘 등이 부착되지 않은 벌크 낚싯줄용 모노필라멘트/실/거트 (제39류, 제4206호 또는 제11부)\n(c) 낚싯대 전용 백/하드케이스 (제4202호)\n(d) 낚싯대용 벨이지만 고정용 핀/클립이 장착되지 않은 단순 비전기식 비금속 벨 (제8306호)\n(e) 사냥용 입질 경보 피리 및 동물의 소리를 흉내 내는 데코이 콜 (제9208호)\n(f) 짐승 포획용 일반 덫, 올가미 (재질별 분류)\n(g) 박제된 조수류 유인물 (제9705호)" ,
  "contentEn": "This heading covers line fishing tackle (rods, reels, hooks, artificial baits, floats), fish landing nets, butterfly nets, and decoy birds for hunting (except stuffed birds of heading 97.05).\n\nIt includes :\n- Fishing rods (subheading 9507.10) made of bamboo, fiberglass, carbon fiber, or plastics.\n- Fish-hooks (subheading 9507.20) of all sizes (with or without snoods attached).\n- Fishing reels (subheading 9507.30) including spinning, baitcasting, and electric reels.\n- Other tackle (subheading 9507.90) including artificial bait (flies, lures), floats (cork/quill), sinkers, line winders, strike indicators, landing nets, butterfly nets, and decoy birds (wooden/plastic bird replicas).\n\nExcludes feathers for making flies (heading 05.05/67.01), bulk monofilament line cut to length (Chapter 39/Section XI), rod cases (heading 42.02), and decoy mouth calls (heading 92.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 95.07 to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
