const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9706",
  "titleKo": "97.06 - 골동품(제작 후 100년을 초과한 것으로 한정한다)",
  "titleEn": "97.06 - Antiques of an age exceeding 100 years.",
  "contentKo": "이 호에는 제작 후 100년을 초과한 골동품(Antiques) 중에서 제9701호부터 제9705호까지(회화, 판화, 조각, 우표, 학술수집품 등)에 분류되지 않는 잔여 골동품들을 분류한다. 100년 이상의 수복/수선된 골동품이라도 본래의 본질적 특징을 유지하는 경우 본 호에 포함한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 제작 후 250년을 초과한 골동품(제9706.10호).\n- 제작 후 100년 초과 250년 이하 골동품(제9706.90호) :\n  - 고가구, 액자 틀, 방 목제 판벽널(panelling).\n  - 100년 초과 고서적, 고문서, 인쇄 악보, 지도, 고판본(제9702호 오리지널 판화 제외).\n  - 100년 초과 도자기 화병 및 세라믹 식탁용품.\n  - 100년 초과 양탄자(카펫), 자수포(자수직물), 레이스, 테피스트리(tapestry) 등 고대 방직용 섬유제품.\n  - 100년 초과 고주화 장식품 및 골동 신변장식용 장신구(제71류 보석 제외).\n  - 100년 초과 금은세공 용기(촛대, 주전자, 은접시 등).\n  - 100년 초과 스테인드글라스 창문 및 납땜 고유리 창문.\n  - 100년 초과 고전 샹들리에 및 램프, 실내 조명기구.\n  - 100년 초과 수제 고철기(쇠자물쇠, 철문 등).\n  - 100년 초과 유리 캐비닛 진열용 소형 소소품(골동 장식 보석상자, 담배상자, 코담배갑, 접이식 부채).\n  - 100년 초과 바이올린 등 고전 악기.\n  - 100년 초과 괘종시계, 회중시계.\n  - 100년 초과 보석조각 가공품(마노 조각석) 및 인장(seals).\n\n[복원 및 보수 요건]\n- 부분적인 수선이나 복원이 이루어진 경우라도 고유의 골동적 원형 특성이 훼손되지 않은 경우 본 호에 분류를 유지한다. (예: 다리가 현대 부재로 보강된 150년 된 오크 목제 테이블, 고대의 직물을 현대 목재 판에 이식 장착한 경우 등).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 제작 후 100년이 초과했더라도, 천연/양식진주 및 귀석, 반귀석 원석이나 단순 연마 가공품 단독 제시물 (제7101호부터 제7103호까지)\n(b) 100년을 초과한 회화, 오리지널 판화, 오리지널 조각상, 사용 주화 컬렉션 등 (해당 9701~9705호 우선 분류 - 주 제5호나목)" ,
  "contentEn": "This heading covers residual antiques of an age exceeding 100 years, divided into over 250 years old (subheading 9706.10) and others (subheading 9706.90), other than those falling in headings 97.01 to 97.05.\n\nIt includes :\n- Antique furniture, frames, and wood panelling.\n- Ancient printed books, music sheets, maps, and prints (except heading 9702).\n- Antique ceramic vases and tableware.\n- Antique textiles: carpets, tapestries, embroidery, and lace.\n- Antique jewellery and gold/silversmiths' wares (candlesticks, ewers, plates).\n- Antique stained glass windows and leaded glass windows.\n- Antique chandeliers, lamps, ironwork, and locks.\n- Antique small cabinet objects (snuff boxes, sweetmeat boxes, fans).\n- Antique musical instruments (e.g. old violins) and antique clocks/watches.\n- Restored or repaired antiques, provided they retain their original character (e.g. antique furniture with reinforced joints or antique tapestry mounted on modern wood support).\n\nExcludes pearls, precious, or semi-precious stones regardless of age (headings 71.01 to 71.03), and antiques that fall in headings 97.01 to 97.05 (Note 5(b))."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 97.06 to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
