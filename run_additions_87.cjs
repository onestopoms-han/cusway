const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_87_01.cjs',
  'append_87_02.cjs',
  'append_87_03.cjs',
  'append_87_04.cjs',
  'append_87_05.cjs',
  'append_87_06.cjs',
  'append_87_07.cjs',
  'append_87_08.cjs',
  'append_87_09.cjs',
  'append_87_10.cjs',
  'append_87_11.cjs',
  'append_87_12.cjs',
  'append_87_13.cjs',
  'append_87_14.cjs',
  'append_87_15.cjs',
  'append_87_16.cjs'
];

console.log('🚀 Running append scripts for Chapter 87 additions...');

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

console.log('✅ Finished executing Chapter 87 addition scripts.');
