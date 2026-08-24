import Database from "better-sqlite3";

const db = new Database("app.db");

console.log("Clearing all existing images...");
db.prepare("UPDATE characters SET image_url = NULL").run();

const rows = db
  .prepare("SELECT id, name FROM characters WHERE image_url IS NULL")
  .all();

const toTag = name => name.trim().toLowerCase().replace(/ /g, "_");

console.log(`Fetching safe images for ${rows.length} characters...`);

for (const row of rows) {
  const tag = toTag(row.name);
  
  const url = `https://safebooru.org/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tag)}+solo+rating:safe+-ai-generated+sort:score:desc&limit=1&json=1`;
  
  try {
    const res = await fetch(url);
    const text = await res.text();

    if (!text || text.trim() === "") {
      console.log(`No results found for ${row.name} (searched tag: ${tag})`);
      continue;
    }

    const data = JSON.parse(text);

    if (data?.[0]?.image) {
      const img = `https://safebooru.org/images/${data[0].directory}/${data[0].image}`;
      db.prepare("UPDATE characters SET image_url = ? WHERE id = ?").run(
        img,
        row.id,
      );
      console.log(`Successfully updated: ${row.name}`);
    }
  } catch (e) {
    console.error(`Error processing ${row.name}:`, e.message);
  }
  
  await new Promise(r => setTimeout(r, 300));
}
console.log("done");
