const fs = require('fs');
const path = require('path');

const targetPath = 'c:/Users/PJH/onestop-ai-custom-service/raw_explanatory_notes.txt';
const scratchDir = 'C:/Users/PJH/.gemini/antigravity-ide/brain/fe0443b8-041e-4f97-be50-86b51fa12037/scratch';
const simulatedPath = 'c:/Users/PJH/onestop-ai-custom-service/simulated_notes.txt';

console.log('Starting restoration process...');

// 1. Backup current raw_explanatory_notes.txt (72.26 - 73.26)
let currentNotes = '';
if (fs.existsSync(targetPath)) {
  currentNotes = fs.readFileSync(targetPath, 'utf8');
  console.log('Backed up current notes (72.26 - 73.26). Length:', currentNotes.length);
} else {
  console.log('No current notes file found.');
}

// 2. Initialize with simulated notes (01 - 43)
let initialContent = '';
if (fs.existsSync(simulatedPath)) {
  initialContent = fs.readFileSync(simulatedPath, 'utf8');
  console.log('Loaded simulated notes (01 - 43). Length:', initialContent.length);
} else {
  console.log('Warning: simulated_notes.txt not found. Starting with empty file.');
}
fs.writeFileSync(targetPath, initialContent, 'utf8');

// 3. Get all files in scratch directory
const allFiles = fs.readdirSync(scratchDir);

// 4. Separate append files and the special insert file
const appendFiles = allFiles.filter(f => f.startsWith('append_') && f.endsWith('.js'));
const specialFile = 'insert_44_16_and_append_46.js';

// 5. Custom sort for append files
function getFileScore(filename) {
  const match = filename.match(/append_(\d+)_(\d+|gen|[\w_]+)/);
  if (!match) {
    return { chapter: 999, heading: 999, isGen: false, suffix: '' };
  }
  const chapter = parseInt(match[1], 10);
  const secondPart = match[2];
  if (secondPart === 'gen') {
    return { chapter, heading: 0, isGen: true, suffix: '' };
  }
  const heading = parseInt(secondPart, 10);
  const suffix = secondPart.replace(/^\d+/, '');
  return { chapter, heading, isGen: false, suffix };
}

appendFiles.sort((a, b) => {
  const scoreA = getFileScore(a);
  const scoreB = getFileScore(b);
  if (scoreA.chapter !== scoreB.chapter) {
    return scoreA.chapter - scoreB.chapter;
  }
  if (scoreA.isGen !== scoreB.isGen) {
    return scoreA.isGen ? -1 : 1; // gen first
  }
  if (scoreA.heading !== scoreB.heading) {
    return scoreA.heading - scoreB.heading;
  }
  return scoreA.suffix.localeCompare(scoreB.suffix);
});

console.log(`Sorted ${appendFiles.length} append scripts.`);

// 6. Run all append scripts in sorted order
for (const file of appendFiles) {
  const filePath = path.join(scratchDir, file);
  console.log(`Executing ${file}...`);
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const startToken = 'const data = `';
    const endToken = '`;';
    const startIndex = fileContent.indexOf(startToken);
    const endIndex = fileContent.lastIndexOf(endToken);
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const dataDecl = fileContent.substring(startIndex, endIndex + endToken.length);
      let dataVal = '';
      eval(dataDecl + '; dataVal = data;');
      fs.appendFileSync(targetPath, '\n' + dataVal, 'utf8');
    } else {
      console.warn(`Could not extract data from ${file}, executing via require...`);
      require(filePath);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}

// 7. Execute the special insert script (insert_44_16_and_append_46.js)
const specialPath = path.join(scratchDir, specialFile);
if (allFiles.includes(specialFile)) {
  console.log(`Executing special script: ${specialFile}...`);
  try {
    delete require.cache[require.resolve(specialPath)];
    require(specialPath);
    console.log(`Successfully executed ${specialFile}`);
  } catch (err) {
    console.error(`Error running special script ${specialFile}:`, err);
  }
}

// 8. Append the currentNotes (72.26 - 73.26) to the end
if (currentNotes) {
  console.log('Appending 72.26 - 73.26 notes back to the end...');
  fs.appendFileSync(targetPath, '\n\n' + currentNotes, 'utf8');
}

console.log('Restoration process completed successfully!');
