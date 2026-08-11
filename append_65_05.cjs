const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_65.json';

const newEntry = {
  "hsCode": "6505",
  "titleKo": "65.05 - 모자[메리야스 편물이나 뜨개질 편물의 것과 원단 상태(스트립 모양은 제외한다)인 레이스ㆍ펠트(felt)나 그 밖의 방직용 섬유의 직물류로 만든 것으로 한정하며, 안을 댄 것인지 또는 장식한 것인지에 상관없다], 각종 재료로 만든 헤어네트(hair-net)(안을 대거나 장식한 것인지에 상관없다)",
  "titleEn": "65.05 - Hats and other headgear, knitted or crocheted, or made up from lace, felt or other textile fabric, in the piece (but not in strips), whether or not lined or trimmed; hair-nets of any material, whether or not lined or trimmed.",
  "contentKo": "이 호에는 메리야스 편물이나 뜨개질 편물[올이 총총히 하였거나 펠트(felt)한 것인지에 상관없다]에 의하여 직접 만들어졌거나 원단 상태인 레이스ㆍ펠트(felt)나 그 밖의 방직용 섬유의 직물로 만든 모자류(안을 댄 것이거나 장식한 것인지에 상관없다)를 분류하며 직물류를 기름ㆍ왁스ㆍ고무ㆍ그 밖의 재료로 침투ㆍ피복한 것인지에 상관없다.\n\n이 호에는 또한 봉합하여 만든 모체(hat-shape)를 포함하나 엮은 끈(plaits이나 스트립(strip)을 봉합하거나 그 밖의 결합방법으로 만든 모체나 모자류는 제외한다(제6504호). 이 호에는 또한 제6501호의 해트보디(hat-body)ㆍ후드(hood)ㆍ플래토우(plateaux)[펠트디스크(felt disc)]로 만든 펠트(felt) 모자ㆍ그 밖의 펠트 헤드기어를 포함한다. 단순히 블록을 잡아 모양을 낸 후드(hood)와 테두리가 있는 후드도 여기에 포함한다.\n\n이 호에 분류하는 물품은 안을 대거나 장식한 것인지에 상관없다.\n\n이 호에는 다음의 것을 포함한다.\n\n(1) 모자[리본ㆍ모자핀ㆍ버클(buckle)ㆍ조화(造花)ㆍ잎ㆍ과실ㆍ깃털ㆍ장식품(어떤 재료라도 상관없다)으로 장식하였는지에 상관없다]\n그러나 깃털이나 조화 등으로 만든 모자류는 이 호에서 제외한다(제6506호).\n\n(2) 베레모ㆍ보닛(bonnet)ㆍ두건ㆍ이와 유사한 것 : 이러한 물품은 보통 메리야스 편물이나 뜨개질 편물로 직접 만들며, 올이 총총한 경우가 많다[예: 바스크 베레모(basque beret)]\n\n(3) 특정한 동양풍의 모자류(예: 페즈) : 이들은 보통 메리야스 편물이나 뜨개질 편물로 만들며 올이 총총한 경우가 많다.\n\n(4) 끝이 뾰족한 여러 가지의 모자류(제모 등)\n\n(5) 직업용이나 종교용의 모자류[카톨릭 주교관(mitre)ㆍ카톨릭 성직자의 사각형 모자(biretta)ㆍ각모(mortar-board) 등]\n\n(6) 요리사모ㆍ수녀모ㆍ간호사모ㆍ웨이트레스가 쓰는 모자 등 모자의 특성을 명백히 나타낸 것으로 직물ㆍ레이스ㆍ망직물로 만든 모자류\n\n(7) 방직용 섬유의 직물로 씌운 코르크(cork)나 피드 헬멧(pith helmet)\n\n(8) 방수모자(sou’wester)\n\n(9) 후드(hood)\n그러나 옷에 달린 상태로 제시하는 어깨망토ㆍ소매 없는 외투 등에서 분리할 수 있는 후드(hood)는 여기에서 제외하고, 그 의류와 함께 구성 재료에 따라서 분류한다.\n\n(10) 남자 정장용 체모(top hat)와 오페라용 모자\n\n이 호에는 또한 헤어네트(hair-net)ㆍ스누드(snood)ㆍ이와 유사한 것도 포함한다. 이들은 어떤 재료라도 가능하며 일반적으로 튈(tulle)ㆍ그 밖의 망ㆍ메리야스 편물이나 뜨개질 편물ㆍ사람 머리카락으로 만들어진다.",
  "contentEn": "This heading covers hats and other headgear (whether or not lined or trimmed) made directly by knitting or crocheting (whether or not fulled or felted) or made up from lace, felt or other textile fabric in the piece (whether or not the fabric has been impregnated, coated or covered with oil, wax, rubber or other materials).\n\nThe heading includes hat-shapes made by sewing, but excludes hat-shapes or hats made by sewing together plaits or assembled strips (heading 65.04). It also covers felt hats and other felt headgear made from the hat bodies, hoods or plateaux of heading 65.01, including hoods which have been blocked or have had their brims defined.\n\nThe articles falling in this heading may be lined or trimmed.\n\nThe heading includes :\n\n(1) blocked hoods and capelines of felt;\n(2) berets, bonnets, hoods and the like, usually knitted or crocheted directly to shape;\n(3) certain oriental headwear (e.g., fezzes), usually knitted or crocheted and fulled;\n(4) peaked caps of all kinds;\n(5) professional or ecclesiastical headgear (mitres, birettas, mortar-boards, etc.);\n(6) chefs' hats, nuns' veils, nurses' caps, waitresses' caps, etc.;\n(7) pith or cork helmets covered with textile fabric;\n(8) sou'westers;\n(9) hoods presented separately (but excluding hoods detachable from cloaks, coats, etc., which are classified with the garment according to their constituent material);\n(10) top hats and opera hats.\n\nThe heading also covers hair-nets and snoods of any material (usually tulle, net, knitted or crocheted fabrics, or human hair)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 65.05 to chapter_65.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
