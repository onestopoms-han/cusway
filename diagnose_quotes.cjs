const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';
const content = fs.readFileSync(filePath, 'utf8');

// The issue seems to be double quotes inside double quotes:
// "적층제조"(3D 프린팅이라고도 한다)
// In a JSON string, raw double quotes like "적층제조" break the string boundaries.
// They need to be escaped as \"적층제조\" or replaced.
// Let's write a script to find and display these instances or automatically escape unescaped quotes.

// Let's print the entire element that has "적층제조" to see the full context.
const index = content.indexOf('적층제조');
console.log('Index of 적층제조:', index);
if (index !== -1) {
  const start = Math.max(0, index - 200);
  const end = Math.min(content.length, index + 300);
  console.log('--- CONTEXT ---');
  console.log(content.substring(start, end));
  console.log('---------------');
}
