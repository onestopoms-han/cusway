const fs = require('fs');

const path = 'c:/Users/PJH/onestop-ai-custom-service/src/components/HsClassifier.tsx';
console.log('Reading HsClassifier.tsx...');
let content = fs.readFileSync(path, 'utf8');

// Find start of KOREAN_HS_RULES array
const startToken = 'const KOREAN_HS_RULES: ClassificationRule[] = [';
const startIndex = content.indexOf(startToken);

if (startIndex === -1) {
  console.error('Could not find start of KOREAN_HS_RULES array');
  process.exit(1);
}

// Find matching closing bracket
const arrayStart = startIndex + startToken.length - 1; // index of [
let depth = 0;
let arrayEnd = -1;

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
  console.error('Could not find matching closing bracket');
  process.exit(1);
}

// Replace Precedent and ClassificationRule interfaces with exported ones
content = content.replace('interface Precedent', 'export interface Precedent');
content = content.replace('interface ClassificationRule', 'export interface ClassificationRule');

// Cut the rules array and insert the import statement
const beforeArray = content.substring(0, startIndex);
const afterArray = content.substring(arrayEnd + 1);

// We need to check if there is a trailing semicolon to clean up
let finalAfterArray = afterArray;
if (afterArray.startsWith(';')) {
  finalAfterArray = afterArray.substring(1);
}

const newContent = beforeArray + "import { KOREAN_HS_RULES } from '../data/rules';" + finalAfterArray;

fs.writeFileSync(path, newContent, 'utf8');
console.log('Successfully refactored HsClassifier.tsx!');
