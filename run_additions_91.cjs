const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_91_general.cjs',
  'append_91_01.cjs',
  'append_91_02.cjs',
  'append_91_03.cjs',
  'append_91_04.cjs',
  'append_91_05.cjs',
  'append_91_06.cjs',
  'append_91_07.cjs',
  'append_91_08.cjs',
  'append_91_09.cjs',
  'append_91_10.cjs',
  'append_91_11.cjs',
  'append_91_12.cjs',
  'append_91_13.cjs',
  'append_91_14.cjs'
];

console.log('🚀 Running append scripts for Chapter 91 additions...');

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

console.log('✅ Finished executing Chapter 91 addition scripts.');
