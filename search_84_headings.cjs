const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';
const notesPath = path.join(projectRoot, 'raw_explanatory_notes.txt');

try {
  const rawText = fs.readFileSync(notesPath, 'utf8');

  // Let's find any occurrences of chapter 84 content.
  // Note: Since index for '84.01' is -1, maybe it is written as "8401" or "84_01" or "84. 01"?
  // Let's do a case-insensitive search or look for "제84" in the raw text to see where chapter 84 starts.
  // We can write a search script that searches for "제 84 류" or similar.
  // Let's search for matches of /제\s*84\s*류/
  
  const matches = [];
  const regex = /제\s*84\s*류/g;
  let match;
  while ((match = regex.exec(rawText)) !== null) {
    matches.push({ index: match.index, text: rawText.substring(match.index - 50, match.index + 200) });
  }
  
  console.log('Matches for 제84류:', matches.length);
  matches.slice(0, 10).forEach((m, i) => {
    console.log(`Match ${i}: Index ${m.index}\n${JSON.stringify(m.text)}\n`);
  });

  // Let's also search for "84.01" in the entire raw file without dot: "8401"
  const idx8401 = rawText.indexOf('8401');
  console.log('Index of "8401":', idx8401);
  if (idx8401 !== -1) {
    console.log('Context of 8401:', JSON.stringify(rawText.substring(idx8401 - 50, idx8401 + 250)));
  }

} catch (err) {
  console.error(err);
}
