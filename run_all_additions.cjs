const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;

const additionScripts = [
  'run_chapters_64_67.cjs',
  'run_additions_84.cjs',
  'run_additions_85.cjs',
  'run_additions_86.cjs',
  'run_additions_87.cjs',
  'run_additions_88.cjs',
  'run_additions_89.cjs',
  'run_additions_90.cjs',
  'run_additions_91.cjs',
  'run_additions_92.cjs',
  'run_additions_93.cjs',
  'run_additions_94.cjs',
  'run_additions_95.cjs',
  'run_additions_96.cjs',
  'run_additions_97.cjs'
];

console.log('🚀 모든 관세 해설서 추가 스크립트 실행을 시작합니다...');

additionScripts.forEach(script => {
  const scriptPath = path.join(projectRoot, script);
  if (fs.existsSync(scriptPath)) {
    try {
      console.log(`Executing ${script}...`);
      const output = execSync(`node "${scriptPath}"`, { cwd: projectRoot, encoding: 'utf8' });
      console.log(output.trim());
    } catch (e) {
      console.error(`❌ Error executing ${script}:`, e.message);
    }
  } else {
    console.log(`⚠️ Script not found: ${script}`);
  }
});

console.log('✅ 모든 해설서 JSON 파일 데이터 병합 완료!');
