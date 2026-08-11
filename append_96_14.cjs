const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9614",
  "titleKo": "96.14 - 흡연용 파이프[파이프 볼(pipe bowl)을 포함한다]ㆍ시가홀더ㆍ시가렛홀더, 이들의 부분품",
  "titleEn": "96.14 - Smoking pipes (including pipe bowls) and cigar or cigarette holders, and parts thereof.",
  "contentKo": "이 호에는 궐련이나 엽연초 흡연용 파이프(물파이프 포함), 파이프의 머리부(파이프 볼), 시가/시가렛 홀더 및 이들의 전용 부분품(마우스피스, 축 등)과 파이프 제조용 목재/뿌리 블록 반제품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 흡연용 파이프(smoking pipe) : 일반 파이프, 수연통(물파이프 water pipe), 터키식 파이프, 치북(chibouk), 긴 대나무 담뱃대.\n- 파이프 볼(pipe bowl) : 담뱃잎을 넣어 태우는 컵 모양의 머리 부품.\n- 시가 홀더(cigar holder) 및 시가렛 홀더(cigarette holder) : 시가 또는 담배를 끼워 입에 물 수 있게 한 홀더 파이프.\n- 파이프 제조용 목재/브라이어(briar) 뿌리 블록 : 파이프 형태로 거칠게 깎아 형상만 잡은 반가공 목조 블록.\n- 파이프의 전용 부분품 : 마우스피스(흡구), 축(스템 stem), 파이프 덮개(lids), 흡수성 볼 라이너(liner) 및 필터 카트리지.\n\n[사용 재료 예]\n- 도자기, 테라코타, 점토, 목재, 브라이어 뿌리, 호박(amber), 해포석(meerschaum), 코팔, 상아, 에보나이트, 플라스틱 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전자담배 기기 및 이와 유사한 개인용 전기 기화장치(파이프나 물파이프 외형을 가졌더라도 열선 기화식 장치는 전량 제외) (제8543호)\n(b) 파이프 긁개(scraper, 재떨이 소제용 도구), 파이프 소제용 철사 브러시/클리너 (재질별 분류, 브러시는 제9603호)\n(c) 라이터 (제9613호)" ,
  "contentEn": "This heading covers smoking pipes (including water pipes/shishas), pipe bowls, cigar/cigarette holders, and their parts (stems, mouthpieces, filters), and rough-shaped wooden/briar root blocks for pipe making.\n\nIt includes :\n- Smoking pipes of all materials (clay, wood, briar root, meerschaum, amber, ivory, ebonite).\n- Pipe bowls.\n- Cigar and cigarette holders.\n- Rough-turned wood or briar root blocks for pipe manufacture.\n- Parts: stems, mouthpieces, lids, absorbent liners, and filter cartridges.\n\nExcludes electronic cigarettes (e-cigarettes) or similar electric personal vaporizers (heading 85.43), and pipe cleaning tools or scrapers (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.14 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
