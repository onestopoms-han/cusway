const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8471",
  "titleKo": "84.71 - 자동자료처리기계와 그 단위기기, 자기식이나 광학식 판독기, 자료를 자료매체에 부호 형태로 전사하는 기계와 이러한 자료의 처리기계(따로 분류되지 않은 것으로 한정한다)(+)",
  "titleEn": "84.71 - Automatic data processing machines and units thereof; magnetic or optical readers, machines for transcribing data onto data media in coded form and machines for processing such data, not elsewhere specified or included.",
  "contentKo": "(I) 자동자료처리기계와 그 단위기기\n미리 설정된 프로그램에 따라 논리적으로 관련되는 조작에 의하여 자료를 작성하는 기계이다. 프로그램의 변경 및 수동 개입 없는 자동 작동, 부호화된 자료의 처리가 가능해야 한다.\n(A) 자동자료처리기계(주 제6호가목 요건 충족)\n(1) 처리 중이거나 실행 예정인 프로그램 및 즉시 소요되는 자료 기억 기능\n(2) 사용자 필요에 따른 프로그램 자유 작성(자유 프로그래밍)\n(3) 수리계산 수행\n(4) 처리 중 논리 판단에 따라 스스로 프로그램을 변경할 수 있는 것\n(B) 분리 제시하는 단위기기 (주 제6호다목 요건 충족)\n(i) 자동자료처리시스템에 전용/주로 사용될 것\n(ii) 중앙처리장치에 직접 또는 하나 이상의 단위기기를 거쳐 접속 가능할 것\n(iii) 시스템 내에서 쓰는 부호나 신호의 형식으로 자료를 송수신할 것\n단, 시스템의 키보드, X-Y 코디네이트 입력장치, 디스크 기억장치는 위 요건 충족 시 항상 단위기기로 분류한다.\n\n주요 단위기기 종류 :\n(1) 중앙처리장치(CPU), 주기억장치\n(2) 추가기억장치 (자기/광학 디스크 드라이브, 테이프 라이브러리 등)\n(3) 처리능력 추가장치\n(4) 제어/접속용 기기 (USB 허브 등, 단 네트워크 통신용 제어기는 제8517호)\n(5) 신호변환기\n(6) X-Y 코디네이트 입력장치 (마우스, 라이트 펜, 조이스틱, 트랙볼, 터치스크린, 그래픽 태블릿, 디지타이저)\n\n(II) 자기식/광학식 판독기, 전사기, 자료처리기계\n(A) 자기식/광학식 판독기 : 자기 잉크용 자기식 판독기, 광전지식 광학식 판독기(바코드 리더 포함)\n(B) 부호화 정보 전사기 : 한 매체에서 다른 매체로 전사하는 기계(DVD/CD-ROM 재생 복제기 등), 집적회로(IC) 프로그래머\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 부속품은 제8473호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 전원공급장치(제8504호)\n(b) 모뎀(modem)(제8517호)\n(c) 전자집적회로(제8542호)\n(d) 모의비행장치(제8805호)\n\n[소호해설]\n소호 제8471.30호\n케이스에 손잡이가 달린 것 등 중량이 10kg 이하인 휴대용 디지털 자동자료처리기계(노트북 등)를 분류한다.\n소호 제8471.90호\n스캐너, 키보드, 디스플레이, 광디스크드라이브, 프린터 등으로 구성된 광디스크 파일링 시스템을 포함한다.",
  "contentEn": "This heading covers automatic data processing (ADP) machines and units thereof, as well as magnetic or optical readers, machines for transcribing data and machines for processing such data.\n\nIt includes :\n(I) Automatic data processing machines (satisfying Note 6 (A) - storing program/data, freely programmable, performing arithmetical computations, executing with logical decisions without human intervention).\n(II) Separately presented units of ADP systems (satisfying Note 6 (C) - CPU, storage units, input units, output units, USB hubs, X-Y co-ordinate input devices like mouse, light pen, joystick, touch screen, graphic tablet).\n(III) Magnetic and optical readers (including bar code readers).\n(IV) Machines for transcribing data (CD-ROM/DVD duplicators, IC programmers).\n\nParts and accessories of these machines fall in heading 84.73.\n\nThe heading excludes :\n(a) Power supply units (heading 85.04).\n(b) Modems and telecommunication network units (heading 85.17).\n(c) Electronic integrated circuits (heading 85.42).\n(d) Flight simulators (heading 88.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.71 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
