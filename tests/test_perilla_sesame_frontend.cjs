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
  { input: "볶지않은 들깨가루", expected: "1208.90-9000", desc: "볶지않은 들깨가루" },
  { input: "볶지 않은 들깨가루", expected: "1208.90-9000", desc: "볶지 않은 들깨가루" },
  { input: "안 볶은 들깨가루", expected: "1208.90-9000", desc: "안 볶은 들깨가루" },
  { input: "생들깨", expected: "1207.99-1000", desc: "생들깨 (미가공 원형 종실)" },
  { input: "들깨", expected: "1207.99-1000", desc: "들깨 (미가공 원형 종실)" },
  { input: "볶은 들깨", expected: "2008.19-9000", desc: "볶은 들깨 (원형 낟알)" },
  { input: "참깨가루", expected: "2008.19-3000", desc: "참깨가루 (조제 볶은 참깨가루)" },
  { input: "볶은 참깨가루", expected: "2008.19-3000", desc: "볶은 참깨가루" },
  { input: "볶음참깨 분말", expected: "2008.19-3000", desc: "볶음참깨 분말" },
  { input: "참깨 분말", expected: "1208.90-9000", desc: "참깨 분말 (미가공 생분말)" },
  { input: "깨가루", expected: "2008.19-3000", desc: "깨가루" },
  { input: "생참깨가루", expected: "1208.90-9000", desc: "생참깨가루 (미가공 생분말)" },
  { input: "볶지않은 참깨가루", expected: "1208.90-9000", desc: "볶지않은 참깨가루" },
  { input: "볶지 않은 참깨가루", expected: "1208.90-9000", desc: "볶지 않은 참깨가루" },
  { input: "안 볶은 참깨가루", expected: "1208.90-9000", desc: "안 볶은 참깨가루" },
  { input: "미가공 참깨가루", expected: "1208.90-9000", desc: "미가공 참깨가루" },
  { input: "볶은 참깨 파쇄물", expected: "1207.40-0000", desc: "볶은 참깨 파쇄물 (분석47260-1300)" },
  { input: "파쇄 참깨", expected: "1207.40-0000", desc: "파쇄 참깨" },
  { input: "거칠게 파쇄된 참깨", expected: "1207.40-0000", desc: "거칠게 파쇄된 참깨" },
  { input: "생참깨", expected: "1207.40-0000", desc: "생참깨 (미가공 원형 종실)" },
  { input: "참깨", expected: "1207.40-0000", desc: "참깨 (미가공 원형 종실)" },
  { input: "볶은 참깨", expected: "2008.19-9000", desc: "볶은 참깨 (원형 낟알)" }
];

console.log("=== Testing Frontend Heuristic Rules Logic ===");

function runMockClassifier(prod, mat = "", func = "") {
  const query = (prod + " " + mat + " " + func).toLowerCase().trim();

  const isPerilla = query.includes('들깨') || query.includes('perilla');
  const isSesame = (query.includes('참깨') || (query.includes('깨') && !isPerilla) || query.includes('sesame') || query.includes('sesamum'));
  const isNegatedRoasted = ['볶지않', '볶지 않', '안볶', '안 볶', '미볶', '비볶', '비가열', '미가공', '생', '날것', 'raw', 'unroasted', 'non-roasted', '탈지'].some(kw => query.includes(kw));
  const isTrulyRoasted = !isNegatedRoasted && ['볶은', '볶음', '구운', '로스팅', 'roast', 'toasted', '조제'].some(kw => query.includes(kw));
  const hasPowder = ['가루', '분말', 'powder', 'flour', '세말', '조말', '분'].some(kw => query.includes(kw));

  // 0-0d-0a. 생 들깨 분말 / 볶지않은 들깨가루 / 미가공 들깨가루 (Raw Perilla Flour) 1208.90-9000
  if (isPerilla && hasPowder && (isNegatedRoasted || (!isTrulyRoasted && query.includes('분말') && !query.includes('가루')))) {
    return "1208.90-9000";
  }

  // 0-0d-0b. 들깨가루 / 볶은 들깨가루 (Roasted/Prepared Perilla Seed Flour) 2008.19-9000
  if (isPerilla && hasPowder) {
    return "2008.19-9000";
  }

  // 0-0d-0c. 볶은 들깨 (원형 낟알 형태) 2008.19-9000
  if (isPerilla && isTrulyRoasted) {
    return "2008.19-9000";
  }

  // 0-0d-0d. 생 들깨 (Raw Perilla Seeds) 1207.99-1000
  if (isPerilla) {
    return "1207.99-1000";
  }

  // 0-0f-1. 파쇄된 참깨 / 볶은 참깨 파쇄물 (Crushed Sesame Seeds, 1.25mm 체 통과율 95% 미만 - 분석47260-1300) 1207.40-0000
  if (isSesame && (query.includes('파쇄') || query.includes('부순') || query.includes('거칠') || query.includes('1.25') || query.includes('체') || query.includes('crushed') || query.includes('broken'))) {
    return "1207.40-0000";
  }

  // 0-0d-1. 생 참깨 분말 / 볶지않은 참깨가루 / 미가공 참깨가루 (Raw Sesame Flour) 1208.90-9000
  if (isSesame && hasPowder && (isNegatedRoasted || (!isTrulyRoasted && query.includes('분말') && !query.includes('가루')))) {
    return "1208.90-9000";
  }

  // 0-0d-2. 볶은 참깨가루 / 식용 조제 참깨가루 (Roasted Sesame Powder) 2008.19-3000 로컬 우회 예외 처리
  if (isSesame && hasPowder) {
    return "2008.19-3000";
  }

  // 0-0e. 볶은 참깨 (원형 낟알 형태) 2008.19-9000 로컬 우회 예외 처리
  if (isSesame && isTrulyRoasted) {
    return "2008.19-9000";
  }

  // 0-0f-2. 생 참깨 (Raw Sesame Seeds) 1207.40-0000 로컬 우회 예외 처리
  if (isSesame) {
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
