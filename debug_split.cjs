const fs = require('fs');
const rawText = fs.readFileSync('c:/Users/PJH/onestop-ai-custom-service/simulated_notes.txt', 'utf8');
const chunks = rawText.split(/--------------------------------------------------/);
console.log(`Found ${chunks.length} chunks in simulated_notes.txt`);
for (let i = 0; i < Math.min(20, chunks.length); i++) {
  const line = chunks[i].trim().split('\n')[0];
  console.log(`Chunk ${i}: "${line.substring(0, 80)}"`);
}
