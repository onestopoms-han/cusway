const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9601",
  "titleKo": "96.01 - 가공한 아이보리(ivory)ㆍ뼈ㆍ귀갑(龜甲)ㆍ뿔ㆍ가지진 뿔ㆍ산호ㆍ자개ㆍ그 밖의 동물성 조각용 재료와 그 제품(성형품을 포함한다)",
  "titleEn": "96.01 - Worked ivory, bone, tortoise-shell, horn, antlers, coral, mother-of-pearl and other animal carving material, and articles of these materials (including articles obtained by moulding).",
  "contentKo": "이 호에는 아이보리(상아), 뼈, 거북껍질(귀갑), 동물 뿔(Antler), 산호, 자개(진주모패) 등 동물성의 조각/성형용 천연 원료 중에서 단순 세정/톱질을 초과하여 그라인딩, 선반 절삭(터닝), 밀링, 연마, 천공(드릴링) 등 고도로 가공된 재료(시트, 판, 봉 등) 및 이들을 사용한 조각 완제품과 성형 제품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 가공한 상아(ivory)(제9601.10호) : 코끼리엄니, 하마/바다코끼리/멧돼지의 이빨, 코뿔소 뿔을 가공한 판/디스크 및 조각 완제품.\n- 기타 동물성 조각 제품(제9601.90호) :\n  - 가공한 뼈, 귀갑(거북껍질), 동물 뿔, 천연/응결 산호, 자개(진주모패), 동물 발굽/손톱/부리, 조개껍질(shell), 새 깃대(quill).\n  - 조각용 가루나 웨이스트(scrap)를 녹여 열성형하여 얻은 뿔/귀갑의 재생 성형판.\n  - 수공예 완제품 : 화장분갑, 립스틱 케이스, 빗거울 틀, 사진 액자, 도서 표지, 종이칼(페이퍼나이프), 북마크(서표), 수제 구두주걱(shoe horn), 수저 받침대(칼 받침), 장식용 카메오/인탈리오(신변장식용 제외), 이쑤시개(새 깃대제).\n  - 별도 제시되는 수작업용 편물 바늘, 코바늘, 목제/금속제 공구/칼/면도칼용 조각 자루(손잡이 - 단독 제시품).\n  - 아이보리/자개 등으로 표면을 상감세공(inlaid)하거나 베니어 피복한 보석상자 및 상자류.\n\n[주요 분류 및 가공 한계]\n- 악기용(피아노 건반용 뼈판 -> 9209호), 총기류용(권총 그립판 -> 9305호) 등 타 호에 전용 부분품으로 명백히 분류되는 것은 본 호에서 제외된다. 단, 전용 부분품 형상으로 가공되지 않은 단순한 연마 원판이나 스트립은 본 호에 분류한다.\n- 귀금속, 보석류 장식이 부착된 도검 및 장식품은 본 호에서 제외되어 제71류에 분류된다. 단, 귀금속이 단순 테두리 장식, 문자, 이니셜 등 경미한 부분에만 부착된 것은 본 호에 분류된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 우산, 양산, 걷기용 지팡이용 조각 손잡이 및 팁 (제6603호)\n(b) 모조 장신구(브로치, 귀걸이 등) (제7117호)\n(c) 칼/가위 등 자루가 결합된 완제 식탁용 나이프/도구 (제8211호)\n(d) 안경테 및 광학기기용 프레임 (제9003호)\n(e) 시계 보호 커버 외의 일반 시계 케이스 (제91류)\n(f) 완구, 보드게임용 말, 주사위 (제95류)\n(g) 미술용 조상, 조각 원작품 및 박제용 조류 수집품 (제97류)" ,
  "contentEn": "This heading covers worked animal carving materials (ivory, bone, tortoise-shell, horn, antlers, coral, mother-of-pearl) shaped as sheets, rods, or plates, and finished carved/moulded articles of these materials.\n\nIt includes :\n- Worked ivory and its articles (subheading 9601.10) from elephant, walrus, or hippopotamus tusks/teeth.\n- Other animal carving materials and articles (subheading 9601.90) including worked bone, tortoise-shell, horn, coral, mother-of-pearl, and feather quills.\n- Finished items: powder compacts, letter openers (paper knives), shoe horns, picture frames, book-markers, carved cutlery handles (presented separately), and cameo/intaglio (not for jewelry).\n- Wooden/metal box structures inlaid or veneered with worked ivory/shell.\n\nExcludes ivory plates shaped as piano key coverings (heading 92.09), handgun grip plates (heading 93.05), umbrella handles (heading 66.03), imitation jewelry (heading 71.17), and toys/chessmen (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.01 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
