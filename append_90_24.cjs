const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9024",
  "titleKo": "90.24 - 재료(예: 금속ㆍ목재ㆍ직물ㆍ종이ㆍ플라스틱)의 경도ㆍ항장력ㆍ압축성ㆍ탄성이나 그 밖의 기계적 성질의 시험용 기기",
  "titleEn": "90.24 - Machines and appliances for testing the hardness, strength, compressibility, elasticity or other mechanical properties of materials (for example, metals, wood, textiles, paper, plastics).",
  "contentKo": "이 호에는 금속, 목재, 콘크리트, 고무, 플라스틱, 가죽, 섬유 직물, 종이 등의 기계적 성질(경도, 인장강도, 탄성, 압축성, 연성, 굽힘 저항, 전단강도 등)을 물리적으로 측정하는 시험 기기 및 이들의 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 금속재료 시험기기(제9024.10호) :\n  - 인장(항장력) 시험기(tensile testing machine) : 금속 봉, 선, 스프링의 인장 및 신장률 측정용 기기.\n  - 경도 시험기(hardness tester) : 브리넬(Brinell) 시험기(강구 압입식), 록웰(Rockwell)/비커스(Vickers) 시험기(다이아몬드 피라미드식), 쇼어(Shore)/스클레로스코프(반발식), 진자 경도계(pendulum).\n  - 굽힘(굴곡) 시험기(bending tester) 및 충격 시험기(impact tester, 샤르피/아이조드식).\n  - 연성 시험기(ductility tester) : 금속 판의 구멍 뚫림 한계 깊이 측정기.\n  - 절곡, 압축(compression), 전단(shearing) 시험기 및 피로 시험기(fatigue tester, 고속 회전 굽힘식/전자식).\n- 그 밖의 재료용 시험 기기(제9024.80호) :\n  - 방직용 섬유 시험기 : 단사, 실, 케이블의 인장 강도 시험기(동력시험기 dynamometer, 신장계 extensometer), 직물 수축률 측정기, 마찰 마모 마멸 시험기(wear and tear tester).\n  - 종이/판지/고무/연질 플라스틱 시험기 : 파열강도 시험기, 내절(절곡) 시험기, 소성 시험기(plasticity tester), 반발 탄성 시험기.\n  - 목재, 콘크리트, 경질 플라스틱 시험기 : 압축/굽힘/전단 강도 시험기.\n  - 주물사(모래형) 시험기 : 주조 주물사의 인장/압축력 측정용 및 주형 표면 경도 시험기.\n- 부분품과 부속품(제9024.90호) : 시료 고정용 조(jaw) 및 클램프(clamp), 하중 전달용 레버 및 추, 충격 해머 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 금속/재료 미세 결정 구조 관찰용 금속현미경 (제9011호)\n(b) 재료 분석용 또는 기공율/열팽창 측정용 물리화학 분석기 (제9027호)\n(c) 재료의 내부 결함, 균열, 흠집을 검출하는 비파괴 초음파/전자기 탐상기 (제9031호)\n(d) 가공 치수 검사용 마이크로미터 및 캘리퍼스 (제9017호)\n(e) 실의 꼬임 횟수를 세는 연수계(torsion counter) (제9031호)" ,
  "contentEn": "This heading covers machines and appliances used in laboratory or industrial testing to determine the mechanical properties (hardness, tensile strength, elasticity, compressibility, ductility, or wear resistance) of metals, wood, concrete, rubber, plastics, paper, or textiles.\n\nIt includes :\n- Metal testing equipment (subheading 9024.10) including tensile testing machines, hardness testers (Brinell, Rockwell, Vickers, Shore scleroscopes, and pendulum types), bending and impact testers, ductility testing machines, and fatigue testers.\n- Other material testing equipment (subheading 9024.80) including textile dynamometers/extensometers, fabric wear/tear testers, paper burst/fold testers, rubber plasticity/rebound elasticity testers, concrete/wood compression testing machines, and foundry sand mould hardness testers.\n- Parts and accessories (subheading 9024.90).\n\nExcludes metallographic microscopes (heading 90.11), physical analysis devices or dilatometers (heading 90.27), non-destructive testing (NDT) flaw detectors (heading 90.31), dimensional micrometers/callipers (heading 90.17), and yarn torsion counters (heading 90.31)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.24 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
