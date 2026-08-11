const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';
const content = fs.readFileSync(filePath, 'utf8');

// Print the context at position 3557 precisely
const errorPos = 3557;
const start = Math.max(0, errorPos - 150);
const end = Math.min(content.length, errorPos + 250);

console.log('--- EXACT CONTEXT AROUND 3557 ---');
console.log(content.substring(start, end));
console.log('---------------------------------');

// Also print the characters at errorPos and their character codes
const chunk = content.substring(errorPos - 10, errorPos + 10);
console.log('10 chars before and after errorPos:', JSON.stringify(chunk));
for (let i = 0; i < chunk.length; i++) {
  console.log(`char: ${chunk[i]}, code: ${chunk.charCodeAt(i)}`);
}
