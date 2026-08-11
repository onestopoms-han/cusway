const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_85_01.cjs',
  'append_85_02.cjs',
  'append_85_03.cjs',
  'append_85_04.cjs',
  'append_85_05.cjs',
  'append_85_06.cjs',
  'append_85_07.cjs',
  'append_85_08.cjs',
  'append_85_09.cjs',
  'append_85_10.cjs',
  'append_85_11.cjs',
  'append_85_12.cjs',
  'append_85_13.cjs',
  'append_85_14.cjs',
  'append_85_15.cjs',
  'append_85_16.cjs',
  'append_85_17.cjs',
  'append_85_18.cjs',
  'append_85_19.cjs',
  'append_85_21.cjs',
  'append_85_22.cjs',
  'append_85_23.cjs',
  'append_85_24.cjs',
  'append_85_25.cjs',
  'append_85_26.cjs',
  'append_85_27.cjs',
  'append_85_28.cjs',
  'append_85_29.cjs',
  'append_85_30.cjs',
  'append_85_31.cjs',
  'append_85_32.cjs',
  'append_85_33.cjs',
  'append_85_34.cjs',
  'append_85_35.cjs',
  'append_85_36.cjs',
  'append_85_37.cjs',
  'append_85_38.cjs',
  'append_85_39.cjs',
  'append_85_40.cjs',
  'append_85_41.cjs',
  'append_85_42.cjs',
  'append_85_43.cjs',
  'append_85_44.cjs',
  'append_85_45.cjs',
  'append_85_46.cjs',
  'append_85_47.cjs',
  'append_85_48.cjs',
  'append_85_49.cjs'
];

console.log('🚀 Running append scripts for Chapter 85 additions...');

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

console.log('✅ Finished executing Chapter 85 addition scripts.');
