const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Let's print characters around position 3638 (absolute index in the CURRENT file state)
  const pos = 3638;
  const start = Math.max(0, pos - 100);
  const end = Math.min(content.length, pos + 100);
  
  console.log('--- CONTEXT AROUND 3638 ---');
  console.log(content.substring(start, end));
  console.log('---------------------------');
  
  // Character analysis
  const chunk = content.substring(pos - 15, pos + 15);
  console.log('Chunk around 3638:', JSON.stringify(chunk));
} catch (err) {
  console.error(err);
}
