import { readFileSync } from "fs";
import Database from "better-sqlite3";

const db = new Database("app.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    series TEXT,
    image_url TEXT,
    tags TEXT
  );
  CREATE TABLE IF NOT EXISTS ratings (
    character_id INTEGER PRIMARY KEY,
    elo INTEGER DEFAULT 1200,
    comparisons INTEGER DEFAULT 0
  );
`);

const characters = JSON.parse(readFileSync("characters.json", "utf-8"));
const insertChar = db.prepare(
  "INSERT OR IGNORE INTO characters (name, series, tags) VALUES (?, ?, ?)",
);
const insertRating = db.prepare(
  "INSERT OR IGNORE INTO ratings (character_id) VALUES (?)",
);

db.transaction(rows => {
  for (const c of rows) {
    const info = insertChar.run(c.name, c.series, JSON.stringify(c.tags));
    const id =
      info.lastInsertRowid ||
      db.prepare("SELECT id FROM characters WHERE name = ?").get(c.name).id;
    insertRating.run(id);
  }
})(characters);

console.log(`Seeded ${characters.length} characters`);
