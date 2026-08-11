const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9505",
  "titleKo": "95.05 - 축제용품ㆍ카니발용품이나 그 밖의 오락용품[마술용품과 기술(奇術)용품을 포함한다]",
  "titleEn": "95.05 - Festive, carnival or other entertainment articles, including conjuring tricks and novelty jokes.",
  "contentKo": "이 호에는 일반적으로 비내구성 재료(종이, 얇은 플라스틱 등)로 제조되어 특정 축제(크리스마스, 할로윈 등), 카니발, 가장무도회에 사용되는 장식 및 가장용품, 그리고 장난/마술/기교용품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 크리스마스 축제용품(제9505.10호) :\n  - 인조 크리스마스 트리(천연 나무 제외), 아기 예수 탄생 세트(모형 인형), 천사/산타클로스 피규어.\n  - 크리스마스 트리용 장식품(번쩍이는 박편/티아라, 채색된 유리 방울/구, 동물 모양 장식품).\n  - 크리스마스 크래커, 선물용 크리스마스 양말, 모조 나무 토막.\n- 기타 축제/카니발/가장/마술용품(제9505.90호) :\n  - 가장용품 및 분장도구 : 파티용 가면, 가짜 귀/코, 마녀 가발, 일회용 종이 모자, 가짜 콧수염/턱수염(단, 6704호 고급 분장 가발은 제외).\n  - 파티 분위기 돋우기 용품 : 색종이 조각(콘페티 confetti), 카니발 테이프(종이 롤 스트리머), 판지제 나팔, 불어 부풀리는 종이 피리(블로우아웃 blow-out).\n  - 축제 데코레이션 : 실내 장식용 종이꽃, 화환, 종이 제등(랜턴).\n  - 마술 및 기교용구 : 카드 마술용 특수 카드 세트, 마술사용 이중 보관함/상자, 비밀 칸막이가 달린 특수 마술 테이블.\n  - 장난/조크 용품 : 재채기 가루(sneezing powder), 깜짝 스펀지 과자, 물 분사 단추/꽃(Japanese flower).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 천연 생 크리스마스 트리 (제06류)\n(b) 크리스마스용 양초 (제3406호)\n(c) 크리스마스 트리용 조립식 금속/플라스틱 스탠드 (재질별 분류)\n(d) 실용성이 있는 카니발 축제용 가장 직물 의류 (제61류 또는 제62류 가장복)\n(e) 실용적인 내구성 가죽/플라스틱 가장용 모자 (제65류)\n(f) 축제 포장용 종이 상자, 플라스틱 쇼핑백 (제39류 또는 제48류)\n(g) 크리스마스 트리 장식용 전기 꼬마전구 라이트 스트링 (제9405호)\n(h) 교회 예배 및 의식용으로 영구 배치되는 성인상, 조각상 (해당 재질별 분류)" ,
  "contentEn": "This heading covers articles traditionally used at festivals (like Christmas, Halloween), carnival ornaments, fancy dress accessories, conjuring tricks, and novelty jokes, usually made of non-durable materials.\n\nIt includes :\n- Christmas articles (subheading 9505.10) including artificial Christmas trees, nativity scenes, angels, Santa Claus figures, Christmas crackers, stockings, and baubles.\n- Other festive or carnival articles (subheading 9505.90) including paper masks, false noses/ears, wigs (except heading 67.04), paper hats, blow-outs, confetti, carnival streamers, and paper lanterns.\n- Magic and joke novelties (9505.90) including conjuring card decks, trick boxes, sneezing powder, and squirt buttons.\n\nExcludes natural Christmas trees (Chapter 06), candles (heading 34.06), textile fancy dress (Chapter 61 or 62), and decorative lighting strings (heading 94.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 95.05 to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
