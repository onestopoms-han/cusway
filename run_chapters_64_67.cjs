const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

// 64류, 65류, 66류, 67류 스크립트 목록 (존재하는 파일 확인용 및 순차 실행용)
const scripts = [
  // 제64류
  'append_64_01.cjs',
  'append_64_02.cjs',
  'append_64_03.cjs',
  'append_64_04.cjs',
  'append_64_05.cjs',
  'append_64_06.cjs',
  // 제65류
  'append_65_01.cjs',
  'append_65_02.cjs',
  'append_65_04.cjs',
  'append_65_05.cjs',
  'append_65_06.cjs',
  'append_65_07.cjs',
  // 제66류
  'append_66_01.cjs',
  'append_66_02.cjs',
  'append_66_03.cjs',
  // 제67류
  'append_67_01.cjs',
  'append_67_02.cjs',
  'append_67_03.cjs',
  'append_67_04.cjs'
];

console.log('🚀 Starting batch execution of Chapters 64, 65, 66, 67 scripts...');

scripts.forEach((script) => {
  const scriptPath = path.join(projectRoot, script);
  if (fs.existsSync(scriptPath)) {
    console.log(`Executing: ${script}...`);
    try {
      const output = execSync(`node "${scriptPath}"`, { cwd: projectRoot, encoding: 'utf8' });
      console.log(output.trim());
    } catch (err) {
      console.error(`❌ Error executing ${script}:`, err.message);
    }
  } else {
    console.warn(`⚠️ Warning: Script not found at ${scriptPath}`);
  }
});

console.log('✅ All specified scripts processed!');
