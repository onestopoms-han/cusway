const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9018",
  "titleKo": "90.18 - 내과용ㆍ외과용ㆍ치과용ㆍ수의과용 기기[신티그래픽(scintigraphic)식 진단기기ㆍ그 밖의 전기식 의료기기와 시력 검사기기를 포함한다](+)",
  "titleEn": "90.18 - Instruments and appliances used in medical, surgical, dental or veterinary sciences, including scintigraphic diagnostic apparatus, other electro-medical apparatus and sight-testing instruments.",
  "contentKo": "이 호에는 내과, 외과, 치과, 수의과 의사가 진료, 예방, 수술, 치료에 직업상 사용하는 광범위한 의료 기기, 전기식 의료 장비, 광학식 안과/시력 검사기 및 이들의 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전기식 진단용 기기(제9018.11~19호) :\n  - 심전계(ECG)(제9018.11호), 심장음기록계(phonocardiograph), 심장경.\n  - 초음파 영상진단기(Ultrasonic scanning)(제9018.12호).\n  - 자기공명 촬영기기(MRI)(제9018.13호).\n  - 신티그래픽(scintigraphic)식 진단기기(제9018.14호) : 감마 카메라, 양전자방출단층촬영기(PET).\n  - 기타 전기진단기(제9018.19호) : 뇌파계(EEG), 맥파계, 청력계(audiometer), 혈압측정장치.\n- 자외선/적외선 응용 의료기기(제9018.20호) : 광선치료기(actinotherapy).\n- 주사기, 바늘, 카테터 등(제9018.31~39호) :\n  - 주사기(일반, 피하, 세척용 주사기)(제9018.31호).\n  - 관 모양 금속 바늘 및 외과 봉합용 바늘(제9018.32호).\n  - 카테터(catheter), 캐뉼러(cannulae), 흡인관, 외과 봉합용 스테이플러(제9018.39호).\n- 치과용 기타 기기(제9018.41~49호) :\n  - 치과용 드릴 엔진(회전식 암 드릴)(제9018.41호).\n  - 치과용 겸자(forceps), 근관 치료기(reamer, file), 아말감 충전기, 치석 제거기(스케일러), 치과용 인상재 트레이, 아말가메이터, 초음파 치석제거기, 치과 기구가 결합된 치과용 의자(제9018.49호).\n- 안과용 기타 기기(제9018.50호) : 검안경(ophthalmoscope), 안압계, 시력검정기(약시교정경, 검영굴절검사기, 각막곡율계), 안과용 세극등 현미경(slit lamp).\n- 그 밖의 의료 기기(제9018.90호) :\n  - 외과용 나이 메스(scalpel), 가위, 겸자, 견인기(retractor), 도뇨관, 고온/전기 소작기.\n  - 마취기 및 부속 마스크, 인공신장(혈액투석) 장치, 내시경(복강경, 방광경, 위경, 결장경 등).\n  - 고압산소실(hyperbaric chamber), 소아 유아용 인공보육기(incubator), 침술용 침(acupuncture).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 살균 소독된 캣거트(catgut) 봉합사 (제3006호)\n(b) 실험실 검사용 진단 시약 및 테스트 스트립 (제3822호)\n(c) 의료 검사용 고무 위생용품 (제4014호) 및 X선 방사선 장치 (제9022호)\n(d) X선 형광 스크린 및 X선 튜브 (제9022호)\n(e) 실험실용/화학용 일반 유리 용기 (제7017호) 및 혈액 보존용 단순 유리병 (제7010호)\n(f) 기계요법용 장치, 마사지기, 인공호흡기, 에어로졸 치료기 (제9019호)\n(g) 정형외과용 기기, 인공 관절/보철 및 부목/깁스 뼈 고정구 (제9021호)\n(h) 체온계 (제9025호) 및 소리굽쇠 (제9209호)\n(ij) 의학 분석용 원심분리기, 분광광도계, pH미터 등 일반 화학분석기 (제9027호)\n(k) 치과용 기기가 결합되지 않은 단순 치과용 의자, 수술대, 검사대 (제9402호)\n(l) 신체장애인용 휠체어 및 차량 (제8713호)\n(m) 의료용 기기에 내장되지 않고 독립 제시되는 텔레비전/비디오 카메라 (제8525호)" ,
  "contentEn": "This heading covers instruments and appliances used in medical, surgical, dental, or veterinary sciences for diagnostic, prevention, surgical, or treatment purposes, including electro-medical, sight-testing, and scintigraphic diagnostic apparatus.\n\nIt includes :\n- Electro-diagnostic apparatus (subheadings 9018.11 to 9018.19) including Electrocardiographs (ECG: 9018.11), Ultrasonic scanning (9018.12), Magnetic Resonance Imaging (MRI: 9018.13), Scintigraphic apparatus (PET/Gamma camera: 9018.14), and EEG/audiometers (9018.19).\n- Ultra-violet or infra-red ray apparatus (subheading 9018.20).\n- Syringes, needles, catheters, and cannulae (subheadings 9018.31 to 9018.39).\n- Dental instruments (subheadings 9018.41 to 9018.49) including dental drill engines (9018.41), dental forceps, root canal instruments, scalers, and dental units on bases (incorporating spittoons, engines, and lights).\n- Ophthalmic instruments (subheading 9018.50) including ophthalmoscopes, binocular slit lamps, and sight-testing trial lens cases.\n- Other medical/surgical instruments (subheading 9018.90) including scalpels, forceps, retractors, surgical staplers, anaesthetic apparatus, dialysers (artificial kidneys), endoscopes (gastroscopes, laparoscopes), hyperbaric chambers, and baby incubators.\n\nExcludes sterile surgical catgut (heading 30.06), diagnostic reagents (heading 38.22), X-ray apparatus (heading 90.22), mechanotherapy or oxygen therapy units (heading 90.19), orthopaedic appliances or artificial joints (heading 90.21), clinical thermometers (heading 90.25), laboratory analysis instruments (heading 90.27), and medical furniture not incorporating dental/surgical gear (heading 94.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.18 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
