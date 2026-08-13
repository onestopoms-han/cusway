const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const projectRoot = 'c:/Users/PJH/onestop-ai-custom-service';
const dbPath = path.join(projectRoot, 'cusway.db');
const jsonDir = path.join(projectRoot, 'src/data/explanatory_notes');

console.log('🔄 [SQLite Database - Explanatory Note JSON Sync Engine 기동]');
console.log('========================================================');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  // 1. 기존 데이터 테이블 청소
  db.run("DELETE FROM explanatory_notes", (err) => {
    if (err) {
      console.error('❌ Failed to clean explanatory_notes table:', err.message);
      process.exit(1);
    }
    console.log('🧹 [CLEAN] explanatory_notes 테이블을 깨끗하게 초기화했습니다.');
  });

  // 2. JSON 디렉토리 내의 모든 파일 스캔 및 적재
  const files = fs.readdirSync(jsonDir).filter(f => f.endsWith('.json'));
  console.log(`📁 총 ${files.length}개의 Chapter JSON 파일을 발견했습니다. 적재를 진행합니다...`);

  const stmt = db.prepare(`
    INSERT INTO explanatory_notes (heading, content_ko, content_en, section, chapter)
    VALUES (?, ?, ?, ?, ?)
  `);

  let totalInserted = 0;

  files.forEach(file => {
    const filePath = path.join(jsonDir, file);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const notes = JSON.parse(fileContent);
      
      const chapterNum = file.replace(/[^0-9]/g, '');

      notes.forEach(note => {
        const heading = note.hsCode || note.heading || "";
        const contentKo = note.contentKo || note.content_ko || "";
        const contentEn = note.contentEn || note.content_en || "";
        const section = note.section || "";
        const chapter = note.chapter || chapterNum || "";

        stmt.run(heading, contentKo, contentEn, section, chapter);
        totalInserted++;
      });
      console.log(`✅ Loaded ${notes.length} notes from ${file}`);
    } catch (e) {
      console.error(`❌ Error parsing/loading ${file}:`, e.message);
    }
  });

  stmt.finalize(() => {
    console.log('========================================================');
    console.log(`🎉 [SUCCESS] 총 ${totalInserted}개의 해설서 데이터를 SQLite DB에 완전 동기화하였습니다!`);
    db.close();
  });
});
