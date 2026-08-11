const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');

  // Let's print around position 173340
  const pos = 173340;
  const start = Math.max(0, pos - 150);
  const end = Math.min(content.length, pos + 150);
  
  console.log('--- CONTEXT AROUND 173340 ---');
  console.log(content.substring(start, end));
  console.log('-----------------------------');
  
  // Character analysis
  const chunk = content.substring(pos - 15, pos + 15);
  console.log('Chunk around 173340:', JSON.stringify(chunk));
} catch (err) {
  console.error(err);
}
