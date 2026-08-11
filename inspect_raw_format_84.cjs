const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';
const notesPath = path.join(projectRoot, 'raw_explanatory_notes.txt');

try {
  const rawText = fs.readFileSync(notesPath, 'utf8');
  
  // Let's find first occurrence of "제8401호" or "84.01" to see how headings are formatted in raw_explanatory_notes.txt
  const targetIndex = rawText.indexOf('84.01');
  console.log('84.01 index:', targetIndex);
  if (targetIndex !== -1) {
    console.log('Context of 84.01 in raw file:', JSON.stringify(rawText.substring(targetIndex - 100, targetIndex + 300)));
  }

  const targetIndexKo = rawText.indexOf('제84.01호');
  console.log('제84.01호 index:', targetIndexKo);
  if (targetIndexKo !== -1) {
    console.log('Context of 제84.01호 in raw file:', JSON.stringify(rawText.substring(targetIndexKo - 100, targetIndexKo + 300)));
  }

  // Let's find Chapter 84 header
  const targetIndexCh = rawText.indexOf('제84류');
  console.log('제84류 index:', targetIndexCh);
  if (targetIndexCh !== -1) {
    console.log('Context of 제84류 in raw file:', JSON.stringify(rawText.substring(targetIndexCh - 100, targetIndexCh + 300)));
  }

} catch (err) {
  console.error(err);
}
