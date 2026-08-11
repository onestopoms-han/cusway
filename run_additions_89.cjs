const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_89_01.cjs',
  'append_89_02.cjs',
  'append_89_03.cjs',
  'append_89_04.cjs',
  'append_89_05.cjs',
  'append_89_06.cjs',
  'append_89_07.cjs',
  'append_89_08.cjs'
];

console.log('🚀 Running append scripts for Chapter 89 additions...');

scripts.forEach(script => {
  const scriptPath = path.join(projectRoot, script);
  if (fs.existsSync(scriptPath)) {
    try {
      console.log(`Executing ${script}...`);
      const output = execSync(`node "${scriptPath}"`, { cwd: projectRoot, encoding: 'utf8' });
      console.log(output.trim());
    } catch (e) {
      console.error(`❌ Error executing ${script}:`, e.message);
    }
  }
});

console.log('✅ Finished executing Chapter 89 addition scripts.');
