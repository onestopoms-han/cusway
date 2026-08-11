const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_96_general.cjs',
  'append_96_01.cjs',
  'append_96_02.cjs',
  'append_96_03.cjs',
  'append_96_04.cjs',
  'append_96_05.cjs',
  'append_96_06.cjs',
  'append_96_07.cjs',
  'append_96_08.cjs',
  'append_96_09.cjs',
  'append_96_10.cjs',
  'append_96_11.cjs',
  'append_96_12.cjs',
  'append_96_13.cjs',
  'append_96_14.cjs',
  'append_96_15.cjs',
  'append_96_16.cjs',
  'append_96_17.cjs',
  'append_96_18.cjs',
  'append_96_19.cjs',
  'append_96_20.cjs'
];

console.log('🚀 Running append scripts for Chapter 96 additions...');

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

console.log('✅ Finished executing Chapter 96 addition scripts.');
