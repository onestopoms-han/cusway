const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';

const scripts = [
  'append_84_32.cjs',
  'append_84_33.cjs',
  'append_84_34.cjs',
  'append_84_35.cjs',
  'append_84_36.cjs',
  'append_84_37.cjs',
  'append_84_38.cjs',
  'append_84_39.cjs',
  'append_84_40.cjs',
  'append_84_41.cjs',
  'append_84_42.cjs',
  'append_84_43.cjs',
  'append_84_44.cjs',
  'append_84_45.cjs',
  'append_84_46.cjs',
  'append_84_47.cjs',
  'append_84_49.cjs',
  'append_84_50.cjs',
  'append_84_51.cjs',
  'append_84_52.cjs',
  'append_84_53.cjs',
  'append_84_54.cjs',
  'append_84_55.cjs',
  'append_84_56.cjs',
  'append_84_57.cjs',
  'append_84_58.cjs',
  'append_84_59.cjs',
  'append_84_60.cjs',
  'append_84_61.cjs',
  'append_84_62.cjs',
  'append_84_63.cjs',
  'append_84_64.cjs',
  'append_84_65.cjs',
  'append_84_66.cjs',
  'append_84_67.cjs',
  'append_84_68.cjs',
  'append_84_70.cjs',
  'append_84_71.cjs',
  'append_84_72.cjs',
  'append_84_73.cjs',
  'append_84_74.cjs',
  'append_84_75.cjs',
  'append_84_76.cjs',
  'append_84_77.cjs',
  'append_84_78.cjs',
  'append_84_79.cjs',
  'append_84_80.cjs',
  'append_84_81.cjs',
  'append_84_82.cjs',
  'append_84_83.cjs',
  'append_84_84.cjs',
  'append_84_85.cjs',
  'append_84_86.cjs',
  'append_84_87.cjs'
];

console.log('🚀 Running append scripts for Chapter 84 additions...');

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

console.log('✅ Finished executing Chapter 84 addition scripts.');
