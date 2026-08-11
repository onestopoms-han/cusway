const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');

  // Let's find index of "8423" and look backwards to see what's actually there
  const idx8423 = content.indexOf('"hsCode": "8423"');
  if (idx8423 !== -1) {
    const start = Math.max(0, idx8423 - 300);
    console.log('--- BEFORE 8423 ---');
    console.log(content.substring(start, idx8423 + 50));
    console.log('-------------------');
  }

  // Also let's find the occurrences and index order of 8418, 8419, 8420, 8421, 8422
  const codes = ["8418", "8419", "8420", "8421", "8422", "8423"];
  codes.forEach(code => {
    let index = content.indexOf(`"hsCode": "${code}"`);
    console.log(`Code "${code}" index: ${index}`);
  });

} catch (err) {
  console.error(err);
}
