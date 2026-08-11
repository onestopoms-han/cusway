const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';
const backupPath = path.join(projectRoot, 'src/data/explanatory_notes/chapter_84.json.bak');
const recoveryReportPath = path.join(projectRoot, 'chapter_84_recovery_analysis.txt');

try {
  console.log('Reading backup file...');
  const content = fs.readFileSync(backupPath, 'utf8');

  // Let's split by the JSON block starter: `{\n    "hsCode":` or similar patterns.
  // We will search for all matches of hsCode to extract blocks.
  const regex = /\{\s*"hsCode"\s*:\s*"([^"]+)"/g;
  let match;
  const blocksInfo = [];
  
  while ((match = regex.exec(content)) !== null) {
    const code = match[1];
    const startIndex = match.index;
    
    // Find the next block start to slice this block
    regex.lastIndex = startIndex + 10; // reset regex search index slightly after current match
    const nextMatch = regex.exec(content);
    const endIndex = nextMatch ? nextMatch.index : content.length;
    
    // Reset regex index to the next match so the loop continues correctly
    if (nextMatch) {
      regex.lastIndex = nextMatch.index;
    } else {
      regex.lastIndex = content.length;
    }

    const blockText = content.substring(startIndex, endIndex).trim();
    
    blocksInfo.push({
      hsCode: code,
      length: blockText.length,
      text: blockText
    });
  }

  let report = `📊 Chapter 84 Backup Blocks Analysis\n`;
  report += `Total parsed blocks: ${blocksInfo.length}\n\n`;
  
  blocksInfo.forEach((b, i) => {
    report += `Block [${i+1}] hsCode: ${b.hsCode} (Length: ${b.length})\n`;
    report += `Start: ${b.text.substring(0, 100).replace(/\n/g, '\\n')}\n`;
    report += `End: ${b.text.substring(b.text.length - 100).replace(/\n/g, '\\n')}\n\n`;
  });

  fs.writeFileSync(recoveryReportPath, report, 'utf8');
  console.log('✅ Analysis complete! Report saved to chapter_84_recovery_analysis.txt');

} catch (err) {
  console.error('❌ Error during backup scan:', err.message);
}
