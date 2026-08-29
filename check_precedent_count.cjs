const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'cusway.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.get("SELECT count(name) as count FROM sqlite_master WHERE type='table' AND name='customs_precedents'", (err, row) => {
    if (err) {
      console.error('❌ Error checking table:', err.message);
      db.close();
      return;
    }
    if (row.count === 0) {
      console.log('⚠️ customs_precedents table does not exist.');
      db.close();
      return;
    }

    db.get("SELECT COUNT(*) as count FROM customs_precedents", (err, rowCount) => {
      if (err) {
        console.error('❌ Error getting count:', err.message);
      } else {
        console.log(`📊 [COUNT] customs_precedents table contains ${rowCount.count} records.`);
      }
      db.close();
    });
  });
});
