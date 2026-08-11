const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:/Users/PJH/.gemini/antigravity-ide/brain/fe0443b8-041e-4f97-be50-86b51fa12037/.system_generated/logs/transcript.jsonl';
const outputPath = 'c:/Users/PJH/onestop-ai-custom-service/find_chapters_results.txt';

async function search() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let results = [];
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;
    // Look for tool calls that write files
    if (line.includes('write_to_file') && line.includes('append_')) {
      results.push(`Line ${lineNum}: ${line.substring(0, 500)}...`);
    }
  }

  fs.writeFileSync(outputPath, results.join('\n'), 'utf8');
  console.log(`Done! Found ${results.length} matches.`);
}

search();
