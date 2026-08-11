const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_64.json';

const newEntry = {
  "hsCode": "6402",
  "titleKo": "64.02 - 그 밖의 신발류[바깥 바닥과 갑피(甲皮)를 고무나 플라스틱으로 만든 것으로 한정한다]",
  "titleEn": "64.02 - Other footwear with outer soles and uppers of rubber or plastics.",
  "contentKo": "이 호에는 바깥 바닥과 갑피(甲皮)가 고무나 플라스틱으로 된 신발류를 분류한다(제6401호의 신발류는 제외한다).\n\n신발의 일부분과 타부분이 서로 다른 특정 재료로 된 신발류일지라도 이 호에 분류한다[예: 바닥은 고무이고 갑피(甲皮)는 플라스틱표면층이 육안으로 식별 가능한 직물인 것 ; 이 경우에는 색채의 변화는 고려하지 않는다].\n\n이 호에는 특히 다음의 것을 분류한다.\n\n(a) 리벳(rivet)이나 이와 유사한 장치를 단 여러 가지로 성형된 부분품으로 구성하는 스키부츠 ;\n\n(b) 구두의 뒷닫이 가죽(quarter)이나 뒷축(counter)이 없는 클로그(clog)[갑피(甲皮)가 보통 리벳팅 방식으로 신발기부나 기단에 부착되어 단일체로 만들어져 있는 것] ;\n\n(c) 구두의 뒷닫이 가죽(quarter)이나 뒷축 가죽(counter)이 없는 슬리퍼[갑피(甲皮)를 단일체로 만들었거나 꿰매지 않고 조립한 것으로서, 스티칭(stitching)에 의하여 바닥에 부착시킨 것] ;\n\n(d) 샌들[발등을 지나는 끈과 어떠한 방법이든 바닥에 붙인 뒷축 가죽(counter)이나 뒷굽 끈으로 구성한다] ;\n\n(e) 끈 타입(thong type)샌들[끈을 바닥의 구멍에 끼워 넣는 플러그(plug) 방법으로 바닥에 부착시킨 것] ;\n\n(f) 단일체로 만든 방수되지 않는 신발(예: 목욕용 슬리퍼)",
  "contentEn": "This heading covers footwear with outer soles and uppers of rubber or plastics, other than those of heading 64.01.\n\nFootwear remains in this heading even if it is made partly of one and partly of another of the specified materials (e.g., the soles may be of rubber and the uppers of woven fabric with an external layer of plastics being visible to the naked eye; for the purpose of this provision no account should be taken of any resulting change of colour).\n\nThe heading covers, inter alia :\n\n(a) Ski-boots consisting of several moulded parts hinged on rivets or similar devices;\n\n(b) Clogs without quarter or counter, the uppers of which are produced in one piece usually attached to the base or platform by riveting;\n\n(c) Slippers or mules without quarter or counter, the uppers of which, being produced in one piece or assembled other than by stitching, are attached to the sole by stitching;\n\n(d) Sandals consisting of straps across the instep and of counter or heelstrap attached to the sole by any process;\n\n(e) Thong-type sandals in which the thongs are attached to the sole by plugs which lock into holes in the sole;\n\n(f) Non-waterproof footwear produced in one piece (for example, bathing slippers)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 64.02 to chapter_64.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
