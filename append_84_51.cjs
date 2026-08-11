const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8451",
  "titleKo": "84.51 - 세탁용ㆍ클리닝용ㆍ쥐어짜기용ㆍ건조용ㆍ다림질용ㆍ프레스용[퓨징프레스(fusing press)를 포함한다]ㆍ표백용ㆍ염색용ㆍ드레싱용ㆍ완성가공용ㆍ도포용ㆍ침지(沈漬)용 기계류[제8450호의 것은 제외하며, 방적용 실ㆍ직물류나 이들 제품에 사용하는 것으로 한정한다]와 리놀륨과 같은 바닥깔개의 제조에 사용되는 직물이나 그 밖의 지지물에 페이스트를 입히는 기계, 직물류의 감기(reeling)용ㆍ풀기(unreeling)용ㆍ접음용ㆍ절단용ㆍ핑킹(pinking)용 기계",
  "titleEn": "84.51 - Machinery (other than machines of heading 84.50) for washing, cleaning, wringing, drying, ironing, pressing (including fusing presses), bleaching, dyeing, dressing, finishing, coating or impregnating textile yarns, fabrics or made up textile articles and machines for applying the paste to the base fabric or other support used in the manufacture of floor coverings such as linoleum; machines for reeling, unreeling, folding, cutting or pinking textile fabrics.",
  "contentKo": "이 호에는 다음과 같은 용도에 사용하는 광범위한 기계를 포함한다.\n(I) 방직용 섬유사ㆍ직물류나 이들의 제품의 세탁용ㆍ표백용ㆍ쥐어짜기용ㆍ클리닝용ㆍ다림질용ㆍ염색용ㆍ건조용이나 이와 유사한 용도의 기계. 다만, 가정형이나 세탁소형 세탁기는 제외한다(제8450호).\n(II) 특수한 새로운 성질을 부여하기 위하여 각각 방적이나 직조한 후 실이나 직물을 드레싱이나 완성 가공하는데 사용하는 기계. 다만, 펠트의 완성 가공용 기계는 제외한다(제8449호).\n(III) 방직용 섬유의 직물류의 감기용ㆍ풀기용ㆍ접음용ㆍ절단용이나 핑킹(pinking)용의 기계\n\n(A) 세탁기ㆍ쥐어짜는 기계ㆍ다림질기나 프레스용 기계(가열장치 부착 여부 무관)\n(1) 공업용 세탁기\n(2) 짜는 기계(wringer)와 압축롤러(mangle)\n(3) 쉐이커 텀블러(shaker tumbler)\n(4) 의류 다리미 및 스팀프레스[퓨징프레스(fusing press) 포함]\n\n(B) 표백기(bleaching machine)ㆍ염색기(dyeing machine)\nJ박스(J-box) 및 여러 가지 사/직물 염색용 기계를 분류한다.\n\n(C) 드라이 클리닝기\n물 대신에 휘발유, 사염화탄소 등의 액체로 청정하는 기계를 말한다.\n\n(D) 건조기\n체임버식 및 가열롤러식 건조기를 포함한다. 다만, 원심 탈수기는 제8421호에 분류된다.\n\n(E) 드레싱 기계와 완성가공기계\n(1) 머서라이징기\n(2) 비틀링기(beetling machine)\n(3) 회전식 밀링기\n(4) 픽킹기 및 벌링기\n(5) 기모기(raising machine)\n(6) 타모기\n(7) 크로핑기(cropping machine)\n(8) 라티네기나 리플링기\n(9) 브러싱기\n(10) 모소기(singeing machine)\n(11) 광택기\n(12) 에머리(emery) 기계\n(13) 원통형 프레스\n(14) 디카타이싱기(decatising machine)\n(15) 폭출기(stentering machine)\n(16) 방수축 가공기\n(17) 도포기(coating machine) 및 침투기(impregnating machine)\n(18) 장식사 제조기계\n\n(F) 직물류의 감기용 기계ㆍ풀기용 기계ㆍ접음기ㆍ절단기ㆍ핑킹(pinking)용 기계\n직물용으로 한정하여 분류하며 결함 검사 및 측정 장치 결합형을 포함한다.\n\n부분품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품도 또한 이 호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 범용 가열장치(제8419호)\n(b) 캘린더기(제8420호)\n(c) 원심 탈수기 및 분리기(제8421호)",
  "contentEn": "This heading covers a wide range of machinery used for washing, cleaning, wringing, drying, ironing, pressing, bleaching, dyeing, dressing, finishing, coating or impregnating textile yarns, fabrics or made up textile articles (excluding household or laundry washing machines of heading 84.50).\n\nIt includes :\n(I) Commercial washing, wringing and pressing machines (industrial washers, fusing presses, garment steam finishers).\n(II) Bleaching and dyeing machinery (J-boxes, yarn dyeing machines).\n(III) Dry-cleaning machines (using petroleum, carbon tetrachloride, etc.).\n(IV) Dryers (chamber dryers, cylinder dryers, stenter dryers).\n(V) Dressing and finishing machines (mercerising, raising, cropping, coating, impregnating, pleating, flocking machines).\n(VI) Fabric folding, reeling, cutting or pinking machines.\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) General heating apparatus (heading 84.19).\n(b) Calenders and roller glazing machines (heading 84.20).\n(c) Centrifugal hydro-extractors (heading 84.21)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.51 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
