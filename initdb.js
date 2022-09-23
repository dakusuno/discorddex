const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./md.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS chapter(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id VARCHAR(64)
    );`);
});

db.close();