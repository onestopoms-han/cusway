const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');

  // Let's check how many elements we can successfully parse and map.
  // The block array has duplicate codes (e.g. 8423 and 8424 are in multiple places)
  // Let's write a script that attempts to clean the file by matching blocks, identifying duplicate or truncated entries,
  // and reconstructing the JSON array only from valid, complete blocks.
  
  // Let's print out the exact content of Block [19] (hsCode = 8418) and see where it ends.
  // We can write a diagnostic file with detailed info.
  
  const blocks = content.split(/\s*\{\s*\"hsCode\"\s*:/);
  
  let report = "--- DETAILED BLOCK INFO ---\n";
  blocks.forEach((block, idx) => {
    if (idx === 0) return;
    const match = block.match(/^\s*\"(\w+)\"/);
    const code = match ? match[1] : 'unknown';
    
    report += `\n[Block ${idx}] hsCode: ${code}\n`;
    report += `Start: ${block.substring(0, 150).replace(/\n/g, '\\n')}\n`;
    report += `End: ${block.substring(block.length - 150).replace(/\n/g, '\\n')}\n`;
  });
  
  fs.writeFileSync('c:/Users/PJH/onestop-ai-custom-service/chapter_84_block_details.txt', report, 'utf8');
  console.log('✅ Block details written to chapter_84_block_details.txt');

} catch (err) {
  console.error(err);
}
