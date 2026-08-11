const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');

  // Let's find index of "8418" (which is at 178733) and index of "8423" (which is at 182541).
  // Between 178733 and 182541, there is a block of text.
  // The end of 8418 seems to have been cut off, and then 8423 starts immediately.
  // Wait, let's look at the index values:
  // "8418" index: 178733
  // "8423" index: 182541 (only ~3.8KB after 8418!)
  // And the others are:
  // "8419" index: 208982
  // "8420" index: 239559
  // "8421" index: 245718
  // "8422" index: 290408
  
  // This means the array contains objects in an incorrect order:
  // [..., 8418, 8423, ..., 8419, 8420, 8421, 8422, ...] ?
  // Or is it that 8418 itself is split and 8423 was inserted in the middle?
  // Let's write a script to parse the file as chunks (by matching `  {\n    "hsCode":` and see what elements are present in the JSON).
  // Since it cannot be parsed by JSON.parse, we can split it manually by: `  {\n    "hsCode":`
  
  const blocks = content.split(/\s*\{\s*\"hsCode\"\s*:/);
  console.log(`Total blocks: ${blocks.length}`);
  
  blocks.forEach((block, idx) => {
    if (idx === 0) return; // preamble
    // Get the first 100 characters of each block to identify it
    const match = block.match(/^\s*\"(\w+)\"/);
    const code = match ? match[1] : 'unknown';
    console.log(`Block [${idx}]: hsCode = ${code}, length = ${block.length}`);
  });

} catch (err) {
  console.error(err);
}
