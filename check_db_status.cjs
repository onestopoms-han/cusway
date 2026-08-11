const fs = require('fs');
const path = require('path');

const dbDir = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes';
const reportPath = 'c:/Users/PJH/onestop-ai-custom-service/db_status_report.txt';

function checkStatus() {
  let output = "📊 HS 해설서 데이터베이스 (제1류 ~ 제97류) 구축 현황 정밀 진단 리포트\n\n";

  const missingChapters = [];
  const placeholderChapters = []; // Present but very small/empty
  const completedChapters = [];

  for (let ch = 1; ch <= 97; ch++) {
    if (ch === 77 || ch === 98) continue;

    const chStr = ch.toString().padStart(2, '0');
    const filePath = path.join(dbDir, `chapter_${chStr}.json`);

    if (!fs.existsSync(filePath)) {
      missingChapters.push(chStr);
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      if (!Array.isArray(data) || data.length === 0) {
        placeholderChapters.push({ ch: chStr, reason: "비어 있는 배열 ([])" });
      } else if (data.length <= 2 && data[0].hsCode && data[0].hsCode.endsWith('_gen') && content.length < 5000) {
        placeholderChapters.push({ ch: chStr, reason: `총설만 존재하거나 데이터가 너무 적음 (항목 수: ${data.length}개)` });
      } else {
        completedChapters.push({ ch: chStr, count: data.length });
      }
    } catch (err) {
      placeholderChapters.push({ ch: chStr, reason: `JSON 파싱 오류: ${err.message}` });
    }
  }

  output += "==================================================\n";
  output += `✅ [완료] 정상적으로 구축된 류 (${completedChapters.length}개):\n`;
  output += "==================================================\n";
  const completedGroups = completedChapters.map(c => `제${c.ch}류(${c.count}개)`);
  output += completedGroups.join(', ') + "\n\n";
  
  output += "==================================================\n";
  output += `⚠️ [보완 필요] 파일은 존재하나 내용이 비어있거나 불완전한 류 (${placeholderChapters.length}개):\n`;
  output += "==================================================\n";
  placeholderChapters.forEach(p => {
    output += `- 제${p.ch}류: ${p.reason}\n`;
  });
  output += "\n";

  output += "==================================================\n";
  output += `❌ [누락] 아예 파일이 존재하지 않는 류 (${missingChapters.length}개):\n`;
  output += "==================================================\n";
  output += missingChapters.map(ch => `제${ch}류`).join(', ') + "\n";

  fs.writeFileSync(reportPath, output, 'utf8');
  console.log(`✨ Status report saved to: ${reportPath}`);
}

checkStatus();
