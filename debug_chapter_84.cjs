const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';
const fileContent = fs.readFileSync(filePath, 'utf8');

console.log('File size:', fileContent.length);
console.log('First 500 chars:', fileContent.substring(0, 500));
console.log('Error surroundings:', fileContent.substring(3500, 3800));
