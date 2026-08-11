const fs = require('fs');
const rawText = fs.readFileSync('c:/Users/PJH/onestop-ai-custom-service/simulated_notes.txt', 'utf8');
const chunks = rawText.split(/--------------------------------------------------/);

for (let i = 0; i < chunks.length; i++) {
  const trimmed = chunks[i].trim();
  if (!trimmed) continue;
  
  const chapterHeaderMatch = trimmed.match(/^제\s*(\d+)\s*류/);
  const headingMatch = trimmed.match(/^(\d{2})\.(\d{2})\s*-\s*(.+)/);
  const fallbackHsMatch = trimmed.match(/^(\d{2})\.(\d{2})/);
  const engHeaderMatch = trimmed.match(/^\[ENGLISH VERSION\s*-\s*(CHAPTER\s*\d+|SECTION\s*[IVX]+|\d{2}\.\d{2})\]/i);

  if (chapterHeaderMatch) {
    // Match chapter header
  } else if (headingMatch) {
    // Match heading
  } else if (fallbackHsMatch) {
    // Match fallback
  } else if (engHeaderMatch) {
    console.log(`Chunk ${i} matches English Header: "${trimmed.substring(0, 100).replace(/\n/g, ' ')}"`);
  } else {
    console.log(`Chunk ${i} MISSED ALL: "${trimmed.substring(0, 100).replace(/\n/g, ' ')}"`);
  }
}
