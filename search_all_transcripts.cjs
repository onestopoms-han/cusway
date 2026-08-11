const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/PJH/.gemini/antigravity-ide/brain';

// Regex to match any heading from 64.01 to 69.14 or chapter markers
const regex = /(제\s*6[4-9]\s*류|6[4-9]\.\d{2}|6[4-9]\d{2})/i;

function searchTranscripts() {
  if (!fs.existsSync(brainDir)) {
    console.log(`❌ Brain directory not found at: ${brainDir}`);
    return;
  }

  const dirs = fs.readdirSync(brainDir);
  console.log(`🔍 Scanning ${dirs.length} directories in ${brainDir} using regular expression...`);

  let foundCount = 0;

  for (const dir of dirs) {
    if (dir === 'tempmediaStorage') continue;
    
    const transcriptPath = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(transcriptPath)) {
      continue;
    }

    try {
      const content = fs.readFileSync(transcriptPath, 'utf8');
      const lines = content.split('\n');
      
      let matchedInDir = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Apply regex check
        const match = line.match(regex);
        if (match) {
          // Verify if it's user input or model output writing/replacing file contents
          if (line.includes('"type":"USER_INPUT"') || line.includes('write_to_file') || line.includes('replace_file_content')) {
            if (!matchedInDir) {
              console.log(`\n==================================================`);
              console.log(`📂 Found match in Conversation: ${dir}`);
              console.log(`==================================================`);
              matchedInDir = true;
            }
            try {
              const data = JSON.parse(line);
              console.log(`[Step ${data.step_index}] Source: ${data.source} (Matched: "${match[0]}")`);
              const textContent = data.content || (data.tool_calls && JSON.stringify(data.tool_calls)) || '';
              console.log(`   Snippet: ${textContent.substring(0, 300)}...\n`);
            } catch (e) {
              console.log(`[Line ${i+1}] (Matched: "${match[0]}") Snippet: ${line.substring(0, 150)}...\n`);
            }
            foundCount++;
          }
        }
      }
    } catch (err) {
      console.error(`Error reading ${dir}: ${err.message}`);
    }
  }

  console.log(`\n✨ Search completed. Found ${foundCount} potential matches.`);
}

searchTranscripts();
