const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_90_01.cjs',
  'append_90_02.cjs',
  'append_90_03.cjs',
  'append_90_04.cjs',
  'append_90_05.cjs',
  'append_90_06.cjs',
  'append_90_07.cjs',
  'append_90_08.cjs',
  'append_90_10.cjs',
  'append_90_11.cjs',
  'append_90_12.cjs',
  'append_90_13.cjs',
  'append_90_14.cjs',
  'append_90_15.cjs',
  'append_90_16.cjs',
  'append_90_17.cjs',
  'append_90_18.cjs',
  'append_90_19.cjs',
  'append_90_20.cjs',
  'append_90_21.cjs',
  'append_90_22.cjs',
  'append_90_23.cjs',
  'append_90_24.cjs',
  'append_90_25.cjs',
  'append_90_26.cjs',
  'append_90_27.cjs',
  'append_90_28.cjs',
  'append_90_29.cjs',
  'append_90_30.cjs',
  'append_90_31.cjs',
  'append_90_32.cjs',
  'append_90_33.cjs'
];

console.log('🚀 Running append scripts for Chapter 90 additions...');

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

console.log('✅ Finished executing Chapter 90 addition scripts.');
