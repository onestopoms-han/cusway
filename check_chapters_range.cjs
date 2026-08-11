const fs = require('fs');

const notesPath = 'c:/Users/PJH/onestop-ai-custom-service/raw_explanatory_notes.txt';

try {
  const rawText = fs.readFileSync(notesPath, 'utf8');
  console.log('Total raw text length:', rawText.length);
  
  // Let's search for "원자로" in the whole file and print index and surrounding text
  const idx = rawText.indexOf('원자로');
  console.log('Index of "원자로":', idx);
  if (idx !== -1) {
    console.log('Context of "원자로":', JSON.stringify(rawText.substring(idx - 100, idx + 300)));
  }

  // Let's do a case-insensitive search for Chapter headings or numbers to understand structure.
  // Maybe chapter numbers are written like "8401" but in a split chunk? 
  // Wait! Is chapter 84 even inside raw_explanatory_notes.txt?
  // Let's search for "제85" or "85.01" to see if chapters 85+ are there.
  console.log('Index of "제85":', rawText.indexOf('제85'));
  console.log('Index of "제90":', rawText.indexOf('제90'));
  console.log('Index of "85.01":', rawText.indexOf('85.01'));

} catch (err) {
  console.error(err);
}
