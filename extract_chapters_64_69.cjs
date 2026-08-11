const fs = require('fs');
const path = require('path');

const logFilePath = 'C:/Users/PJH/.gemini/antigravity-ide/brain/43e68018-ac2b-4424-acfe-3da0f2f2eb30/.system_generated/logs/transcript_full.jsonl';
const outputDir = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes';

function extractData() {
  if (!fs.existsSync(logFilePath)) {
    console.log(`❌ Log file not found: ${logFilePath}`);
    return;
  }

  console.log(`🔍 Scanning target log file...`);
  const content = fs.readFileSync(logFilePath, 'utf8');
  const lines = content.split('\n');
  
  // To accumulate notes by chapter
  // Structure: { '64': [ { hsCode, titleKo, titleEn, contentKo, contentEn }, ... ] }
  const chaptersData = {
    '64': [], '65': [], '66': [], '67': [], '68': [], '69': []
  };

  // We will scan for USER inputs and model write actions
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    try {
      const step = JSON.parse(line);
      const text = step.content || (step.tool_calls && JSON.stringify(step.tool_calls)) || '';

      // Check if it looks like explanatory notes content
      // Let's find patterns like "64.01", "68.12", "제69류" etc.
      // We parse the paragraphs/notes
      
      // Let's check for specific chapter indicators
      for (const ch of ['64', '65', '66', '67', '68', '69']) {
        const chRegex = new RegExp(`(제\\s*${ch}\\s*류|${ch}\\.\\d{2}|${ch}\\d{2})`, 'i');
        if (chRegex.test(text)) {
          // If it's a USER_INPUT or a model tool_call writing file, let's keep it
          // We can log this step
          console.log(`✨ Found Chapter ${ch} reference in Step ${step.step_index} (${step.source})`);
          
          // Let's store the text content with step metadata so we can reconstruct later
          chaptersData[ch].push({
            step_index: step.step_index,
            source: step.source,
            text: text
          });
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Reconstruct chapters
  for (const ch of ['64', '65', '66', '67', '68', '69']) {
    const entries = chaptersData[ch];
    if (entries.length === 0) {
      console.log(`⚠️ No raw data found for Chapter ${ch}`);
      continue;
    }

    console.log(`📦 Reconstructing Chapter ${ch} with ${entries.length} segments...`);
    
    // Save raw text segments to a text file for inspection first
    const rawOutPath = path.join(outputDir, `chapter_${ch}_raw_extracted.txt`);
    fs.mkdirSync(outputDir, { recursive: true });
    
    let rawText = '';
    entries.forEach(e => {
      rawText += `\n\n=== STEP ${e.step_index} (${e.source}) ===\n${e.text}\n`;
    });
    
    fs.writeFileSync(rawOutPath, rawText, 'utf8');
    console.log(`💾 Saved raw data to ${rawOutPath}`);
  }

  console.log(`\n🎉 Extraction finished. Please review the raw extracted files.`);
}

extractData();
