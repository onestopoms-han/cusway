const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Diagnosis:
  // "heat-trans  {"
  // There is a sudden, abrupt end of the JSON object of heading 84.18 (or similar) without proper closing,
  // directly jumping to the opening of heading 84.23: "{\n    \"hsCode\": \"8423\"".
  // This indicates a massive chunk of data between heading 84.18/84.19 and 84.23 might be truncated or poorly formatted.
  // Wait, let's see how much text was lost or if we can close the previous entry safely, or find where the closing quote went.
  // Specifically: "heat-trans" seems to be part of "heat-transfer".
  // Let's inspect Note 10 or Chapter 84 headings around 84.18, 84.19, 84.20, 84.21, 84.22.
  // Are headings 84.19 to 84.22 present or completely missing?
  // Let's search the file content for "8418", "8419", "8420", "8421", "8422".
  
  const searchCodes = ["8418", "8419", "8420", "8421", "8422", "8423"];
  searchCodes.forEach(code => {
    console.log(`Has "${code}":`, content.includes(`"hsCode": "${code}"`));
  });

} catch (err) {
  console.error(err);
}
