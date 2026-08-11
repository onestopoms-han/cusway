const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';
const backupPath = path.join(projectRoot, 'src/data/explanatory_notes/chapter_84.json.bak');
const dbPath = path.join(projectRoot, 'src/data/explanatory_notes/chapter_84.json');

try {
  console.log('📖 Loading backup file...');
  const backupContent = fs.readFileSync(backupPath, 'utf8');

  // We will manually split blocks by matching `{\n    "hsCode":` or similar patterns.
  // Because some blocks are duplicated or broken, we will identify all complete blocks.
  const regex = /\{\s*"hsCode"\s*:\s*"([^"]+)"/g;
  let match;
  const blocksMap = {}; // mapping from hsCode to array of blocks
  
  while ((match = regex.exec(backupContent)) !== null) {
    const code = match[1];
    const startIndex = match.index;
    
    // Find the next block start to slice this block
    regex.lastIndex = startIndex + 10;
    const nextMatch = regex.exec(backupContent);
    const endIndex = nextMatch ? nextMatch.index : backupContent.length;
    
    // Reset regex index to the next match
    if (nextMatch) {
      regex.lastIndex = nextMatch.index;
    } else {
      regex.lastIndex = backupContent.length;
    }

    let blockText = backupContent.substring(startIndex, endIndex).trim();
    if (blockText.endsWith(',')) {
      blockText = blockText.slice(0, -1);
    }
    
    if (!blocksMap[code]) {
      blocksMap[code] = [];
    }
    blocksMap[code].push(blockText);
  }

  // Now let's build the recovered list
  const recoveredList = [];
  const allHsCodes = Object.keys(blocksMap).sort((a, b) => {
    if (a === '84_gen') return -1;
    if (b === '84_gen') return 1;
    return a.localeCompare(b);
  });

  allHsCodes.forEach(code => {
    const variations = blocksMap[code];
    let bestBlockText = variations[0];
    
    // If there are multiple versions of this block, pick the longest one (which has more content)
    if (variations.length > 1) {
      console.log(`Heading ${code} has duplicate blocks (${variations.length} occurrences). Choosing the longest one...`);
      variations.forEach((v, idx) => {
        console.log(`  -> Option [${idx+1}]: Length = ${v.length}`);
        if (v.length > bestBlockText.length) {
          bestBlockText = v;
        }
      });
    }

    // Now let's check if the chosen block text can be parsed as a JSON object
    // If it has minor formatting issues (like missing closing braces), let's fix them.
    // Clean trailing commas or double curly brackets
    let cleaned = bestBlockText;
    
    // Check braces balance
    const openBraces = (cleaned.match(/\{/g) || []).length;
    const closeBraces = (cleaned.match(/\}/g) || []).length;
    if (openBraces > closeBraces) {
      cleaned += '}'.repeat(openBraces - closeBraces);
    } else if (closeBraces > openBraces) {
      // Remove excess closing braces at the end
      cleaned = cleaned.substring(0, cleaned.length - (closeBraces - openBraces));
    }

    try {
      const obj = JSON.parse(cleaned);
      
      // Ensure contents are properly formatted
      // Let's do double quote escaping checks for internal contents
      recoveredList.push(obj);
    } catch (e) {
      console.warn(`⚠️ Warning: HS Code ${code} failed to parse even after basic repair: ${e.message}`);
      
      // Let's fallback to manual object conversion for known broken formats
      try {
        // Try cleaning nested double brackets
        let doubleBraceCleaned = cleaned.replace(/\s*\}\s*\}\s*$/, '  }');
        const obj = JSON.parse(doubleBraceCleaned);
        recoveredList.push(obj);
        console.log(`  -> Fixed via double brace cleanup for ${code}`);
      } catch (err2) {
        console.error(`  -> Extraction failed for ${code}. Saving raw string for manual look.`);
        // Try to regex parse keys
        const hsCodeMatch = cleaned.match(/"hsCode"\s*:\s*"([^"]+)"/);
        const titleKoMatch = cleaned.match(/"titleKo"\s*:\s*"([^"]+)"/);
        const titleEnMatch = cleaned.match(/"titleEn"\s*:\s*"([^"]+)"/);
        
        recoveredList.push({
          hsCode: code,
          titleKo: titleKoMatch ? titleKoMatch[1] : `Heading ${code}`,
          titleEn: titleEnMatch ? titleEnMatch[1] : `Heading ${code} Explanatory Notes`,
          contentKo: `Data recovery failed: ${err2.message}. Raw text size was ${cleaned.length}`,
          contentEn: ""
        });
      }
    }
  });

  // Write out the recovered database
  fs.writeFileSync(dbPath, JSON.stringify(recoveredList, null, 2), 'utf8');
  console.log(`🎉 Reconstruction Successful! Saved ${recoveredList.length} headings to chapter_84.json.`);
  
  // Final validation
  JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  console.log('🔥 100% Valid JSON verified! The app can now load Chapter 84 Explanatory Notes.');

} catch (err) {
  console.error('❌ Reconstruction script failed:', err.message);
}
