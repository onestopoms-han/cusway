const fs = require('fs');
const path = require('path');

const notesPath = 'c:/Users/PJH/onestop-ai-custom-service/raw_explanatory_notes.txt';
const outputDir = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Parsing raw_explanatory_notes.txt with robust multi-format matching...');
const rawText = fs.readFileSync(notesPath, 'utf8');

// Split by separators
const chunks = rawText.split(/--------------------------------------------------/);
console.log(`Found ${chunks.length} raw text chunks.`);

const chaptersData = {};

function addEntry(chapterNum, entry) {
  if (!chapterNum) return;
  const chap = chapterNum.padStart(2, '0');
  if (!chaptersData[chap]) chaptersData[chap] = [];
  
  // Prevent duplicate hsCodes
  const idx = chaptersData[chap].findIndex(e => e.hsCode === entry.hsCode);
  if (idx !== -1) {
    // Merge
    if (entry.contentKo) chaptersData[chap][idx].contentKo = (chaptersData[chap][idx].contentKo + '\n\n' + entry.contentKo).trim();
    if (entry.contentEn) chaptersData[chap][idx].contentEn = (chaptersData[chap][idx].contentEn + '\n\n' + entry.contentEn).trim();
    if (entry.titleKo && !chaptersData[chap][idx].titleKo) chaptersData[chap][idx].titleKo = entry.titleKo;
    if (entry.titleEn && !chaptersData[chap][idx].titleEn) chaptersData[chap][idx].titleEn = entry.titleEn;
  } else {
    chaptersData[chap].push(entry);
  }
}

for (let i = 0; i < chunks.length; i++) {
  const trimmed = chunks[i].trim();
  if (!trimmed) continue;

  // Let's print out missed elements for verification
  let matched = false;

  // 1. Chapter headers / section headers
  const chapterHeaderMatch = trimmed.match(/^제\s*(\d+)\s*류/) || trimmed.match(/^(?:제\s*[IVXLCDM]+\s*부\s*\n+)?제\s*(\d+)\s*류/i);
  if (chapterHeaderMatch) {
    const chapterNum = chapterHeaderMatch[1].padStart(2, '0');
    let contentKo = trimmed;
    let contentEn = '';
    const engIndex = trimmed.search(/\[ENGLISH VERSION - (CHAPTER \d+|SECTION [IVX]+)\]/i);
    if (engIndex !== -1) {
      contentKo = trimmed.substring(0, engIndex).trim();
      contentEn = trimmed.substring(engIndex).trim();
    }
    
    addEntry(chapterNum, {
      hsCode: `${chapterNum}_gen`,
      titleKo: `제${chapterNum}류 총설 및 주`,
      titleEn: `Chapter ${chapterNum} General Notes`,
      contentKo,
      contentEn
    });
    matched = true;
    continue;
  }

  // 2. English headers e.g. [ENGLISH VERSION - 01.02]
  const engHeaderMatch = trimmed.match(/^\[ENGLISH VERSION\s*-\s*(CHAPTER\s*\d+|SECTION\s*[IVX]+|GENERAL RULES|GIR|\d{2}\.\d{2})\]/i);
  if (engHeaderMatch) {
    const codeSpec = engHeaderMatch[1];
    const cleanSpec = codeSpec.replace('.', '').trim();
    
    const headingMatch = cleanSpec.match(/^(\d{2})/);
    if (headingMatch) {
      const chapterNum = headingMatch[1];
      const hsCode = cleanSpec.replace(/\s+/g, '');
      addEntry(chapterNum, {
        hsCode,
        titleKo: `${codeSpec} 영문 해설`,
        titleEn: `${codeSpec} Explanatory Notes`,
        contentKo: '',
        contentEn: trimmed
      });
    } else {
      // General or Section notes
      addEntry("01", {
        hsCode: `GIR_eng`,
        titleKo: `통칙 영문 해설`,
        titleEn: `General Rules English Notes`,
        contentKo: '',
        contentEn: trimmed
      });
    }
    matched = true;
    continue;
  }

  // 3. Korean/Standard Headings (e.g., "01.02 - 살아 있는 소(+)")
  const headingMatch = trimmed.match(/^(\d{2})\.(\d{2})\s*-\s*(.+)/);
  if (headingMatch) {
    const chapterNum = headingMatch[1];
    const headingNum = headingMatch[2];
    const hsCode = chapterNum + headingNum;
    
    let titleKo = headingMatch[0].split('\n')[0].trim();
    let contentKo = trimmed;
    let titleEn = '';
    let contentEn = '';
    
    const engToken = `[ENGLISH VERSION - ${chapterNum}.${headingNum}]`;
    const engTokenIndex = trimmed.indexOf(engToken);
    if (engTokenIndex !== -1) {
      contentKo = trimmed.substring(0, engTokenIndex).trim();
      const engSection = trimmed.substring(engTokenIndex + engToken.length).trim();
      titleEn = engSection.split('\n')[0].trim();
      contentEn = engSection;
    }
    
    addEntry(chapterNum, {
      hsCode,
      titleKo,
      titleEn: titleEn || `${chapterNum}.${headingNum} English Notes`,
      contentKo,
      contentEn
    });
    matched = true;
    continue;
  }

  // 4. Fallback HS code format (e.g. "01.02" starting text)
  const fallbackHsMatch = trimmed.match(/^(\d{2})\.(\d{2})/);
  if (fallbackHsMatch) {
    const chapterNum = fallbackHsMatch[1];
    const headingNum = fallbackHsMatch[2];
    const hsCode = chapterNum + headingNum;
    
    let contentKo = trimmed;
    let contentEn = '';
    const engToken = `[ENGLISH VERSION - ${chapterNum}.${headingNum}]`;
    const engTokenIndex = trimmed.indexOf(engToken);
    if (engTokenIndex !== -1) {
      contentKo = trimmed.substring(0, engTokenIndex).trim();
      contentEn = trimmed.substring(engTokenIndex).trim();
    }
    
    addEntry(chapterNum, {
      hsCode,
      titleKo: `${chapterNum}.${headingNum} 해설서`,
      titleEn: `${chapterNum}.${headingNum} Explanatory Notes`,
      contentKo,
      contentEn
    });
    matched = true;
    continue;
  }

  // 5. Section headings (e.g., "제 1 부")
  const sectionHeaderMatch = trimmed.match(/^제\s*([IVXLCDM\d]+)\s*부/i);
  if (sectionHeaderMatch) {
    const secNum = sectionHeaderMatch[1];
    // Put section notes under Chapter 1 or nearest chapter of that section (we'll fallback to chapter 01)
    addEntry("01", {
      hsCode: `section_${secNum}_gen`,
      titleKo: trimmed.split('\n')[0].trim(),
      titleEn: `Section ${secNum} Notes`,
      contentKo: trimmed,
      contentEn: ''
    });
    matched = true;
    continue;
  }

  // 6. GIR (General Interpretative Rules)
  if (trimmed.includes('통칙') || trimmed.includes('GIR')) {
    addEntry("01", {
      hsCode: "GIR_rules",
      titleKo: "HS해석에 관한 통칙",
      titleEn: "General Interpretative Rules",
      contentKo: trimmed,
      contentEn: ''
    });
    matched = true;
    continue;
  }

  // Fallback to closest numeric matching in the chunk text
  const rawCodes = trimmed.match(/\b(\d{2})\.(\d{2})\b/);
  if (rawCodes) {
    const chapterNum = rawCodes[1];
    addEntry(chapterNum, {
      hsCode: rawCodes[1] + rawCodes[2],
      titleKo: `${rawCodes[1]}.${rawCodes[2]} 해설`,
      titleEn: `${rawCodes[1]}.${rawCodes[2]} Explanatory Notes`,
      contentKo: trimmed,
      contentEn: ''
    });
    matched = true;
    continue;
  }
}

// Write the parsed data by chapter
let totalWritten = 0;
for (const [chapter, data] of Object.entries(chaptersData)) {
  const filePath = path.join(outputDir, `chapter_${chapter}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Saved Chapter ${chapter} notes to chapter_${chapter}.json (${data.length} entries).`);
  totalWritten++;
}

console.log(`Successfully split and saved ${totalWritten} chapters!`);
