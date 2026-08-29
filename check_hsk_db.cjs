const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cusway.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT * FROM hs_code_master WHERE hs_code LIKE '8483%'", (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Found ${rows.length} rows for 8483`);
    rows.forEach(r => {
      if (r.name_ko.includes('항공기용') || r.name_ko.includes('롤러 스크루') || r.name_ko.includes('기어')) {
        console.log(r);
      }
    });
  });
});

db.close();
