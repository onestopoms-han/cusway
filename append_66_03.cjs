const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_66.json';

const newEntry = {
  "hsCode": "6603",
  "titleKo": "66.03 - 제6601호나 제6602호의 물품의 부분품ㆍ트리밍(trimming)ㆍ부속품",
  "titleEn": "66.03 - Parts, trimmings and accessories of articles of heading 66.01 or 66.02.",
  "contentKo": "이 호에는 방직용 섬유재료로 만든 부분품ㆍ장식ㆍ부속품과 여러 가지 재료로 만든 커버ㆍ술(tassel)ㆍ가죽끈ㆍ산류(傘類)의 케이스와 이와 유사한 것은 제외한다. 우산ㆍ양산ㆍ지팡이 등과 함께 제시하지만 부착하지 않은 경우에도 별도로 분류한다(이 류의 주 제2호 참조). 이러한 예외규정을 제외하고 이 호에는 제6601호나 제6602호의 물품의 부분품ㆍ부착구ㆍ부속품으로 인정할 수 있는 물품을 분류한다.\n\n이러한 물품은 그 구성 재료[귀금속이나 귀금속을 입힌 금속, 귀석이나 반귀석(천연ㆍ합성ㆍ재생의 것을 포함한다)]에 상관없이 이 호에 분류하며, 다음의 물품을 포함한다.\n\n(1) 손잡이(handle)[손잡이의 미완성제품으로 인정할 수 있는 블랭크(blank)를 포함한다]와 우산ㆍ양산ㆍ지팡이ㆍ채찍 등에 사용하는 손잡이(knob)\n\n(2) 프레임(frame)[자루에 부착된 프레임을 포함한다]ㆍ우산의 살ㆍ프레임용의 펴는 장치\n\n(3) 우산이나 양산용의 대(shaft : stick)[손잡이(handle or knob)가 결합된 것인지에는 상관없다]\n\n(4) 채찍의 자루\n\n(5) 고리쇠(runner)․리브팁(rib tip)․오픈컵(open cup)ㆍ팁컵(tip cup)․페룰(ferrule)․스프링․칼라(collar)․산류(傘類)의 기둥에 부착되는 산의 꼭대기를 각도있게 조절하는 틸팅장치(tilting device)․스파이크․시트스틱용의 그라운드 플레이트(ground plate)ㆍ이와 유사한 것 등\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 미완성 지팡이(제6602호 해설 참조)\n\n(b) 철강으로 만든 튜브, 일정한 길이로 절단한 산류(傘類)의 살(rib)이나 뼈대(stretcher)용의 철강으로 만든 형강(제72류나 제73류)",
  "contentEn": "This heading excludes parts, trimmings or accessories of textile material, and covers, tassels, thongs, umbrella cases or the like, of any material; these are classified separately, even when presented with (but not fitted to) umbrellas, sun umbrellas, walking-sticks, etc. (see Note 2 to this Chapter). Subject to these exclusions, the heading covers parts, fittings and accessories clearly identifiable as intended for articles of heading 66.01 or 66.02.\n\nThese articles are classified in this heading regardless of the materials of which they are made (including precious metal or rolled precious metal, precious or semi-precious stones (natural, synthetic or reconstructed)), and include :\n\n(1) Handles (including blanks identifiable as unfinished handles) and knobs for umbrellas, sun umbrellas, walking-sticks, whips, etc.\n\n(2) Frames (including frames mounted on shafts), ribs and stretchers.\n\n(3) Shafts (sticks) for umbrellas or sun umbrellas, whether or not combined with handles or knobs.\n\n(4) Stocks for whips.\n\n(5) Runners, rib tips, open cups, tip cups, ferrules, springs, collars, tilting devices for adjusting the angle of umbrellas, spikes, ground plates for seat-sticks, and the like.\n\nThe heading excludes :\n(a) Unfinished walking-sticks (see Explanatory Note to heading 66.02).\n(b) Iron or steel tubes, and iron or steel sections, cut to length, for ribs or stretchers (Chapter 72 or 73)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 66.03 to chapter_66.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
