// -*- coding: utf-8 -*-
const fs = require('fs');
const path = require('path');

// Test items
const testCases = [
  { input: "들깨가루", expected: "2008.19-9000", desc: "들깨가루 (조제 볶은 들깨가루)" },
  { input: "볶은 들깨가루", expected: "2008.19-9000", desc: "볶은 들깨가루" },
  { input: "볶음들깨 분말", expected: "2008.19-9000", desc: "볶음들깨 분말" },
  { input: "들깨 분말", expected: "1208.90-9000", desc: "들깨 분말 (미가공 생분말)" },
  { input: "생들깨가루", expected: "1208.90-9000", desc: "생들깨가루 (미가공 생분말)" },
  { input: "생들깨", expected: "1207.99-1000", desc: "생들깨 (미가공 원형 종실)" },
  { input: "들깨", expected: "1207.99-1000", desc: "들깨 (미가공 원형 종실)" },
  { input: "볶은 들깨", expected: "2008.19-9000", desc: "볶은 들깨 (원형 낟알)" },
  { input: "참깨가루", expected: "2008.19-3000", desc: "참깨가루 (조제 볶은 참깨가루)" },
  { input: "볶은 참깨가루", expected: "2008.19-3000", desc: "볶은 참깨가루" },
  { input: "볶음참깨 분말", expected: "2008.19-3000", desc: "볶음참깨 분말" },
  { input: "참깨 분말", expected: "1208.90-9000", desc: "참깨 분말 (미가공 생분말)" },
  { input: "깨가루", expected: "2008.19-3000", desc: "깨가루" },
  { input: "생참깨가루", expected: "1208.90-9000", desc: "생참깨가루 (미가공 생분말)" },
  { input: "생참깨", expected: "1207.40-0000", desc: "생참깨 (미가공 원형 종실)" },
  { input: "참깨", expected: "1207.40-0000", desc: "참깨 (미가공 원형 종실)" },
  { input: "볶은 참깨", expected: "2008.19-9000", desc: "볶은 참깨 (원형 낟알)" }
];

console.log("=== Testing Frontend Heuristic Rules Logic ===");

function runMockClassifier(prod, mat = "", func = "") {
  const query = (prod + " " + mat + " " + func).toLowerCase().trim();

  // 0-0d-0a. 생 들깨가루 / 미가공 들깨분말 (Raw Perilla Flour) 1208.90-9000
  if ((query.includes('들깨') || query.includes('perilla')) && (query.includes('가루') || query.includes('분말') || query.includes('powder') || query.includes('flour') || query.includes('분')) && (query.includes('생') || query.includes('미가공') || query.includes('미볶') || query.includes('비가열') || query.includes('탈지') || query.includes('raw') || query.includes('unroasted') || (!query.includes('볶') && !query.includes('구운') && !query.includes('roast') && !query.includes('toasted') && !query.includes('조제') && !query.includes('가루') && query.includes('분말')))) {
    return "1208.90-9000";
  }

  // 0-0d-0b. 들깨가루 / 볶은 들깨가루 (Roasted/Prepared Perilla Seed Flour) 2008.19-9000
  if ((query.includes('들깨') || query.includes('perilla')) && (query.includes('가루') || query.includes('분말') || query.includes('powder') || query.includes('flour') || query.includes('세말') || query.includes('조말') || query.includes('들깨분'))) {
    return "2008.19-9000";
  }

  // 0-0d-0c. 볶은 들깨 (원형 낟알 형태) 2008.19-9000
  if ((query.includes('들깨') || query.includes('perilla')) && (query.includes('볶') || query.includes('구운') || query.includes('roast') || query.includes('toasted'))) {
    return "2008.19-9000";
  }

  // 0-0d-0d. 생 들깨 (Raw Perilla Seeds) 1207.99-1000
  if (query.includes('들깨') || query.includes('생들깨') || query.includes('perilla seed') || query.includes('perilla')) {
    return "1207.99-1000";
  }

  // 0-0d-1. 생 참깨 분말 / 미가공 참깨가루 (Raw Sesame Flour) 1208.90-9000
  if ((query.includes('참깨') || (query.includes('깨') && !query.includes('들깨')) || query.includes('sesame')) && (query.includes('가루') || query.includes('분말') || query.includes('powder') || query.includes('flour') || query.includes('분')) && (query.includes('생') || query.includes('미가공') || query.includes('미볶') || query.includes('비가열') || query.includes('탈지') || query.includes('raw') || query.includes('unroasted') || (!query.includes('볶') && !query.includes('구운') && !query.includes('roast') && !query.includes('toasted') && !query.includes('조제') && !query.includes('가루') && query.includes('분말')))) {
    return "1208.90-9000";
  }

  // 0-0d-2. 볶은 참깨가루 / 일반 참깨가루 (Roasted Sesame Powder) 2008.19-3000 로컬 우회 예외 처리
  if ((query.includes('참깨') || (query.includes('깨') && !query.includes('들깨')) || query.includes('sesame')) && (query.includes('가루') || query.includes('분말') || query.includes('powder') || query.includes('flour') || query.includes('세말') || query.includes('조말') || query.includes('참깨분') || query.includes('깨분'))) {
    return "2008.19-3000";
  }

  // 0-0e. 볶은 참깨 (원형 낟알 형태) 2008.19-9000 로컬 우회 예외 처리
  if ((query.includes('참깨') || (query.includes('깨') && !query.includes('들깨')) || query.includes('sesame')) && (query.includes('볶') || query.includes('구운') || query.includes('roast') || query.includes('toasted'))) {
    return "2008.19-9000";
  }

  // 0-0f-2. 생 참깨 (Raw Sesame Seeds) 1207.40-0000 로컬 우회 예외 처리
  if (query.includes('참깨') || (query.includes('깨') && !query.includes('들깨')) || query.includes('sesame') || query.includes('생참깨') || query.includes('sesamum')) {
    return "1207.40-0000";
  }

  return "0000.00-0000";
}

let allPassed = true;
testCases.forEach(tc => {
  const actual = runMockClassifier(tc.input);
  if (actual === tc.expected) {
    console.log(`✅ PASS: [${tc.desc}] '${tc.input}' -> ${actual}`);
  } else {
    console.log(`❌ FAIL: [${tc.desc}] '${tc.input}' -> Expected ${tc.expected}, got ${actual}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log("\n🎉 ALL FRONTEND HEURISTIC TESTS PASSED 100%!");
  process.exit(0);
} else {
  console.log("\n⚠️ SOME FRONTEND TESTS FAILED!");
  process.exit(1);
}
