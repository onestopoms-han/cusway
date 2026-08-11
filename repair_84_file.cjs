const fs = require('fs');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Issue detected:
  // "according to type."
  //   }
  //   },
  //   {
  // There is a double closing bracket: "  }\n  }," which violates JSON structure (it should just be "  }," to close the object inside the array).
  // Let's replace the double closing brackets with a single closing bracket.
  
  const target = '"\n  }\n  },';
  const replacement = '"\n  },';
  
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    console.log('✅ Found and corrected the double closing bracket!');
  } else {
    // Try general regex just in case formatting varies
    content = content.replace(/\}\s*\}\s*,\s*\{\s*\"hsCode\"/g, '},\n  {\n    "hsCode"');
    console.log('✅ Applied regex cleanup for nested object brackets.');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ File saved.');

  // Verify
  JSON.parse(content);
  console.log('🎉 Verification Successful! JSON is 100% valid.');
} catch (err) {
  console.error('❌ Still has error:', err.message);
}
