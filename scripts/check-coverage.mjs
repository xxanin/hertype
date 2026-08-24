import Database from "better-sqlite3";

const db = new Database("app.db");

const stats = db.prepare(`
  SELECT 
    COUNT(*) as total, 
    COUNT(image_url) as with_image,
    (COUNT(image_url) * 100.0 / COUNT(*)) as coverage_percent
  FROM characters
`).get();

console.log("=== Database Image Coverage ===");
console.log(`Total Characters: ${stats.total}`);
console.log(`With Images:      ${stats.with_image}`);
console.log(`Coverage:         ${stats.coverage_percent.toFixed(2)}%`);
console.log("\n=== Character Lookup ===");

const targets = ["makima", "ganyu", "kirigiri kyoko", "mikasa"];
const query = db.prepare(`
  SELECT name, image_url 
  FROM characters 
  WHERE name LIKE ? COLLATE NOCASE
`);

for (const target of targets) {
  const results = query.all(`%${target}%`);
  
  if (results.length === 0) {
    console.log(`[${target}] -> Not found in database`);
  } else {
    for (const r of results) {
      console.log(`[${r.name}] -> ${r.image_url ? r.image_url : "NULL (No image fetched)"}`);
    }
  }
}
