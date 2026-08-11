const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8517",
  "titleKo": "85.17 - 전화기(셀룰러 통신망용이나 그 밖의 무선통신망용의 스마트폰과 그 밖의 전화기를 포함한다)와 음성ㆍ영상이나 그 밖의 자료의 송신용ㆍ수신용 그 밖의 기기(근거리 통신망이나 원거리 통신망과 같은 유선ㆍ무선 통신망에서 통신하기 위한 기기를 포함하며, 제8443호ㆍ제8525호ㆍ제8527호ㆍ제8528호의 송신용ㆍ수신용 기기는 제외한다)(+)",
  "titleEn": "85.17 - Telephone sets, including smartphones and other telephones for cellular networks or for other wireless networks; other apparatus for the transmission or reception of voice, images or other data, including apparatus for communication in a wired or wireless network (such as a local or wide area network), other than transmission or reception apparatus of heading 84.43, 85.25, 85.27 or 85.28.",
  "contentKo": "이 호에는 유선/무선 네트워크(전화, 전신, 무선전화/전신, LAN, WAN 등)를 통하여 음성, 영상 또는 기타 자료를 송수신하는 통신 기기들을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(I) 전화기 (셀룰러 및 기타 무선망용 전화기 포함)\n- 유선전화기 : 무선 송수화기(cordless handset)가 결합된 코드리스 전화기 세트 포함.\n- 스마트폰(smartphone) : 3자 애플리케이션 설치 및 동시 실행 등 자동자료처리 기능을 수행할 수 있는 모바일 OS 탑재 스마트폰.\n- 기타 무선망용 전화기 : 셀룰러폰(휴대폰), 위성전화기 등.\n\n(II) 음성, 영상, 기타 자료의 송수신용 기기\n- 기지국(base station) : 셀룰러 통신망이나 기타 무선 네트워크용 기지국 송수신 장비.\n- 엔트리폰 시스템(entry-phone system) : 아파트/건물 로비용 인터폰 및 도어폰 시스템.\n- 비디오폰(videophone) : 영상전화기.\n- 전신 기기 : 메시지 송신기/수신기, 사진전신기기(telephoto, 단 사진처리장비는 제90류).\n- 교환기(switching apparatus) : 유선/무선 네트워크용 자동교환기, 패킷교환기, PBX(사설교환기) 및 수동식 교환대.\n- 무선 송수신기 : 고정식/이동식 무선전화 및 무선전신용 송수신기(MIG, TIG 등 무선 송수화 장비, 동시통역용 무선 송수신기, 선박/항공기용 조난 신호기 등).\n- 네트워크 기기 : 모뎀(modem), 라우터(router), 네트워크 브리지(bridge), 허브(hub), 게이트웨이, 스위칭 허브, 통신 인터페이스 카드(NIC), 중계기(repeater), 데이터 압축기/부호기.\n\n안테나 및 부분품\n- 각종 안테나와 반사식 안테나 및 그 부분품(소호 제8517.71호).\n- 8517호 기기용 기타 부분품(소호 제8517.79호).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 팩시밀리(Fax) 기기 및 복합기 (제8443호)\n(b) 라디오/TV 송신기, 송신기용 카메라, TV 수신기 및 모니터 (제8525, 8527, 8528호)\n(c) 전화기용 배선 케이블, 광섬유 케이블 (제8544호)\n(d) 전화용 릴레이 및 개폐장치 (제8536호)\n(e) 통신 위성 (제8802호)\n(f) 단독 제시되는 자동응답기 (제8519호)\n(g) 전기식 호출 벨 및 인디케이터 (제8531호)\n(h) 삼각대, 모노포드, 바이포드 (제9620호)",
  "contentEn": "This heading covers telephone sets (including smartphones and cellphones) and other apparatus for the transmission or reception of voice, images or other data in wired or wireless networks (LAN, WAN, etc.).\n\nIt includes :\n(I) Telephone sets :\n- Line telephone sets, including cordless handsets combined with a base unit.\n- Smartphones : Cellphones with mobile operating systems capable of downloading and running multiple applications (including third-party apps) simultaneously.\n- Other cellular or wireless telephones (cellphones, satellite phones).\n(II) Other transmission/reception apparatus :\n- Base stations for cellular or wireless networks.\n- Entry-phone systems and videophones.\n- Telegraphic apparatus (excluding facsimiles under heading 84.43).\n- Switching apparatus : Automatic/manual switchboards, PBX systems, packet switchers.\n- Radio-telephonic and radio-telegraphic transceivers (fixed/mobile, marine distress signal transceivers, simultaneous interpretation equipment).\n- Network communication apparatus : Modems, routers, bridges, hubs, repeaters, network interface cards (NICs), multiplexers, and codecs.\n\nAntennas and Parts :\n- Antennas and antenna reflectors of all kinds, and parts thereof (subheading 8517.71).\n- Other parts of the apparatus of heading 85.17 (subheading 8517.79).\n\nThe heading excludes :\n(a) Facsimile machines (heading 84.43).\n(b) Radio or television broadcasting transmitters, receivers, and monitors (headings 85.25, 85.27, 85.28).\n(c) Telephone cords and optical fibre cables (heading 85.44).\n(d) Relay switches (heading 85.36).\n(e) Communication satellites (heading 88.02).\n(f) Stand-alone telephone answering machines (heading 85.19).\n(g) Electric bells and indicators (heading 85.31).\n(h) Tripods, monopods, bipods and similar articles (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.17 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
