import { watch } from 'fs';
import { exec } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('=============================================');
console.log(' CUSWAY File Watcher & Auto Deploy Active');
console.log(' Monitoring folder:', __dirname);
console.log(' (Press Ctrl+C to stop)');
console.log('=============================================');

let isDeploying = false;
let timeoutId = null;

// 파일 변경 감지 이벤트 핸들러 (디바운스 적용하여 파일 저장 시 연쇄 작동 방지)
const triggerDeploy = (filename) => {
  if (isDeploying) {
    console.log(`[SKIP] Deploy in progress, ignoring change in: ${filename}`);
    return;
  }
  
  if (timeoutId) clearTimeout(timeoutId);
  
  timeoutId = setTimeout(() => {
    isDeploying = true;
    console.log(`\n[DETECTED] File changed: ${filename} at ${new Date().toLocaleTimeString()}`);
    console.log('[TRIGGER] Starting auto build and deploy...');
    
    // deploy.bat "auto updated via watcher" 실행
    const proc = exec('deploy.bat "auto updated via watcher"', { cwd: __dirname });
    
    proc.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    proc.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    proc.on('close', (code) => {
      isDeploying = false;
      console.log(`[DEPLOY FINISHED] exit code: ${code}`);
      console.log('\n[WAITING] Standing by for new changes...');
    });
  }, 2000); // 2초 디바운스
};

// src 및 backend 폴더를 재귀적으로 감시
const watchDirs = ['src', 'backend'];
watchDirs.forEach(dir => {
  try {
    watch(join(__dirname, dir), { recursive: true }, (eventType, filename) => {
      // 불필요한 임시 파일이나 캐시 무시
      if (filename && 
          !filename.includes('__pycache__') && 
          !filename.endsWith('.tmp') && 
          !filename.endsWith('.swp')) {
        triggerDeploy(`${dir}/${filename}`);
      }
    });
    console.log(`[WATCHING] Monitoring directory: ./${dir}`);
  } catch (err) {
    console.error(`[ERROR] Failed to watch ./${dir}:`, err.message);
  }
});
