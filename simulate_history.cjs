const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:/Users/PJH/.gemini/antigravity-ide/brain/fe0443b8-041e-4f97-be50-86b51fa12037/.system_generated/logs/transcript.jsonl';
const outputPath = 'c:/Users/PJH/onestop-ai-custom-service/simulated_notes.txt';

async function simulate() {
  console.log('Starting history simulation from logs...');
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let fileContent = '';
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;
    try {
      const step = JSON.parse(line);
      if (step.tool_calls) {
        for (const tc of step.tool_calls) {
          // Check for write_to_file to raw_explanatory_notes.txt
          if (tc.name === 'write_to_file') {
            const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
            if (args.TargetFile && args.TargetFile.includes('raw_explanatory_notes.txt')) {
              fileContent = args.CodeContent || '';
              console.log(`[Line ${lineNum}] Overwrote file using write_to_file. Length: ${fileContent.length}`);
            }
          }
          // Check for replace_file_content to raw_explanatory_notes.txt
          else if (tc.name === 'replace_file_content') {
            const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
            if (args.TargetFile && args.TargetFile.includes('raw_explanatory_notes.txt')) {
              const target = args.TargetContent;
              const replacement = args.ReplacementContent;
              
              if (target && fileContent.includes(target)) {
                fileContent = fileContent.replace(target, replacement);
              } else {
                // If target not found, it is likely an append. Let's just append it.
                fileContent += '\n' + replacement;
              }
            }
          }
        }
      }
    } catch (err) {
      // Ignore parsing errors of incomplete lines if any
    }
  }

  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`Simulation complete! Saved restored text to ${outputPath}. Total length: ${fileContent.length}`);
}

simulate();
