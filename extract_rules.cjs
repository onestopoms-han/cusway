const fs = require('fs');
const path = require('path');

const classifierPath = 'c:/Users/PJH/onestop-ai-custom-service/src/components/HsClassifier.tsx';
const rulesDir = 'c:/Users/PJH/onestop-ai-custom-service/src/data/rules';

if (!fs.existsSync(rulesDir)) {
  fs.mkdirSync(rulesDir, { recursive: true });
}

console.log('Reading HsClassifier.tsx...');
const content = fs.readFileSync(classifierPath, 'utf8');

// Find the start and end of KOREAN_HS_RULES
const startToken = 'const KOREAN_HS_RULES: ClassificationRule[] = [';
const endToken = '];';

const startIndex = content.indexOf(startToken);
if (startIndex === -1) {
  console.error('Could not find start of KOREAN_HS_RULES array');
  process.exit(1);
}

// Find the end token after start index
const arrayStart = startIndex + startToken.length - 1; // [ character
let depth = 0;
let arrayEnd = -1;

// Scan to find matching bracket
for (let i = arrayStart; i < content.length; i++) {
  if (content[i] === '[') depth++;
  else if (content[i] === ']') {
    depth--;
    if (depth === 0) {
      arrayEnd = i;
      break;
    }
  }
}

if (arrayEnd === -1) {
  console.error('Could not find matching closing bracket for rules array');
  process.exit(1);
}

const rawArrayText = content.substring(arrayStart, arrayEnd + 1);

// Write to a temporary file as a module to evaluate it
const tempFilePath = path.join(__dirname, 'temp_rules.cjs');
const tempContent = `
const tempRules = ${rawArrayText};
module.exports = tempRules;
`;
fs.writeFileSync(tempFilePath, tempContent, 'utf8');

const rules = require(tempFilePath);
fs.unlinkSync(tempFilePath); // Cleanup

console.log(`Successfully parsed ${rules.length} classification rules.`);

// Group rules by chapter based on recommendedHsCode
const rulesByChapter = {};
for (const rule of rules) {
  const hsCode = rule.recommendedHsCode || '';
  const cleanCode = hsCode.replace(/\D/g, ''); // Extract only digits
  const chapter = cleanCode.substring(0, 2);
  if (!chapter) {
    console.warn('Skipping rule with invalid HS code:', hsCode);
    continue;
  }
  if (!rulesByChapter[chapter]) {
    rulesByChapter[chapter] = [];
  }
  rulesByChapter[chapter].push(rule);
}

// Write the rules into chapter modules
const chapters = Object.keys(rulesByChapter).sort();
const imports = [];

for (const chap of chapters) {
  const chapRules = rulesByChapter[chap];
  const fileContent = `import { ClassificationRule } from '../../components/HsClassifier';

export const chapter${chap}Rules: ClassificationRule[] = ${JSON.stringify(chapRules, null, 2)};
`;
  const filePath = path.join(rulesDir, `chapter_${chap}.ts`);
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Saved Chapter ${chap} rules with ${chapRules.length} entries.`);
  imports.push(`import { chapter${chap}Rules } from './chapter_${chap}';`);
}

// Write index.ts for simple packaging
const indexContent = `import { ClassificationRule } from '../../components/HsClassifier';
${imports.join('\n')}

export const KOREAN_HS_RULES: ClassificationRule[] = [
  ${chapters.map(chap => `...chapter${chap}Rules`).join(',\n  ')}
];
`;
fs.writeFileSync(path.join(rulesDir, 'index.ts'), indexContent, 'utf8');
console.log('Saved integrated rules index file (src/data/rules/index.ts).');
console.log('Extraction completed successfully!');
