const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_65.json';

const newEntry = {
  "hsCode": "6501",
  "titleKo": "65.01 - 모체(hat-form)[펠트(felt)로 만든 성형하지 않은 것으로서 차양을 붙이지 않은 것으로 한정한다], 펠트(felt)로 만든 플래토우(plateaux)와 망숑(manchon)[슬릿망숑(slit manchon)을 포함한다]",
  "titleEn": "65.01 - Hat-forms, hat bodies and hoods of felt, neither blocked to shape nor with made brims; plateaux and manchons (including slit manchons), of felt.",
  "contentKo": "(A) 모체(hat-form)ㆍ해트보디(hat body)ㆍ후드(hood)[펠트(felt)로 만든 성형하지 않은 것으로서 차양을 붙이지 않은 것으로 한정한다]\n\n모피 펠트로 만든 모체(hat-form)ㆍ해트보디(hat body)ㆍ후드(hood)는 보통 집토끼ㆍ산토끼ㆍ사향쥐ㆍ뉴트리아(nutria)ㆍ수달피의 모피로 만들어지며 ; 울 펠트로 만든 해트포옴(hat-form) 등은 양모나 비큐나 낙타(단봉낙타를 포함한다) 등의 울(wool)이나 헤어(hair)로 만들어진다. 경우에 따라서 펠트(felt)는 앞에서 설명한 재료의 혼합물로 만들어지는 경우도 있으며, 때로는 인조섬유를 혼합하는 경우도 있다.\n\n위의 털을 적절하게 처리를 한 후 흡취법(suction)에 의하여 원추 모양의 모자형에 판판하게 부착되게 하며, 양모의 경우에는 카드한(carded) 섬유를 이중 원추 모양의 형에 얽혀 붙인다[뒤의 경우, 가장 넒은 부분을 둘로 나누면 두 개의 원추형의 모체(hat-form)이 만들어진다]. 그 다음에 뜨거운 물이나 수증기를 살포한 후 만든 원추 모양의 형에서 사용하었던 본래의 원추모형을 떼어낸다. 엉성하게 펠트(felt)된 상태의 이러한 폼(form)(정상적인 국제무역상에서는 알려지지 않고 있다)은 완전히 펠트화시키고, 거의 원추형의 해트보디가 되도록 경화공정과 수축공정을 거친다.\n\n이 호에는 또한 둥근 모자 윗부분이 되도록 끝을 팽팽히 잡아당긴 해트보디(hat body)(때로는 평행한 면을 가진 것도 있지만 보통은 경사졌고 초기 모자 형태를 가진 것도 있다)도 분류한다. 뒤의 것은 평면에 수직으로 놓았을 때 차양 부분이 모자의 윗부분에서 거의 직각상태로 돌출되어 있지 않는다는 점에서 성형한 후드(hood)와는 구별된다(제6505호 참조). 이 호의 이러한 성형하지 않은 해트보디(hat body)ㆍ후드(hood) 등 중 어떤 것은 가끔 하프 캐펄린(half capeline)으로 표현하기도 한다(그러나 완전 캐펄린으로 알려진 물품은 성형가공을 한 것이며, 제6505호에 분류한다).\n\n이 호의 품목분류는 파운싱(pouncing)ㆍ염색ㆍ보강처리와 같은 가공에 따라 영향받지 않는다.\n\n이 호에는 견고한 모자 토대에 고정시키기 위하여 사용하는 “쉬미즈(chemise)”나 행커치프펠트로 알려진 아주 가볍고 얇은 후드(hood)도 포함한다.\n\n(B) 이 호에는 다음의 것도 포함한다.\n\n(1) 펠트(felt)로 만든 플래토우(plateaux) : 초기에는 넓은 바닥(wide-based)을 가진 원추형으로 만든 후에 직경이 약 60㎝가 되도록 평편한 원반 모양으로 늘린 것. 펠트디스크(feltdisc)는 종종 조각 모양으로 절단하여 모자나 캡의 형태로 봉합한다. 군용이나 그 밖의 유니폼드레스용 캡은 펠트(felt)형으로부터 봉합한다.\n\n(2) 펠트(felt)로 만든 망숑(manchon) : 이는 보통 털 펠트의 원추 모양 모자형을 만드는데 사용하는 방법과 유사한 흡취법에 의하여 털을 원통 모양(높이가 40㎝부터 50㎝까지이고 둘레가 약 100㎝ 정도)으로 성형시켜 만든다. 이것은 보통 여자모자로 사용하며 원통형의 것이나 직사각형의 것으로 가느다랗게 베어낸 것을 상관없이 이 호에 분류한다. 직사각형 펠트는 조각 모양으로 절단하여 트리밍(trimming)으로 사용하거나 모자나 캡의 형태로 봉합한다.",
  "contentEn": "(A) Hat-forms, hat bodies and hoods (neither blocked to shape nor with made brims), of felt.\nHat-forms, hat bodies and hoods of fur felt are usually made from the fur of the rabbit, hare, musk-rat, coypu (nutria), beaver or otter; those of wool felt from wool, or the wool or hair of the vicuna, camel (including dromedary), etc. They may also be made of mixtures of these materials, sometimes with the addition of man-made fibres.\n\nAfter suitable treatment, the hair is deposited by suction in a uniform layer on a cone-shaped hat mold; in the case of wool, the carded fibres are wrapped around a double-cone mold (in the latter case, cutting through the widest part produces two cones). The cone of wool or fur is then removed from its mold, after being sprayed with hot water or steam. These very loose forms are then fully felted, hardened and shrunk to form hat bodies which are roughly conical.\n\nThis heading also covers hat bodies in which the tip has been slightly rounded, and those (known as capelines) in which the brim has been slightly defined. The latter are distinguished from blocked hoods (heading 65.05) by the fact that the brim does not project at an approximate right angle from the crown. These unblocked hat bodies and hoods are sometimes referred to as half-capelines (completely blocked capelines are classified in heading 65.05).\n\nClassification in this heading is not affected by operations such as pouncing, dyeing, or stiffening.\n\nThis heading also includes very light and thin hoods, known as chemises or handkerchief felts, used as foundations for hats.\n\n(B) The heading also includes :\n(1) Plateaux of felt, which are produced by defining the brim of a wide-based cone and then stretching it to form a flat disc of about 60 cm in diameter.\n(2) Manchons of felt, which are sleeves of felt (about 40 to 50 cm in height and about 100 cm in circumference) obtained by the suction process. They are used mainly in the millinery trade. Both cylindrical and rectangular cut sheets of manchons are classified here."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 65.01 to chapter_65.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
