import Database from "better-sqlite3";

const db = new Database("app.db");

const stats = db
  .prepare(
    `
  SELECT 
    COUNT(*) as total, 
    COUNT(image_url) as with_image,
    (COUNT(image_url) * 100.0 / COUNT(*)) as coverage_percent
  FROM characters
`,
  )
  .get();

console.log("Database image coverage:");
console.log(`Total Characters: ${stats.total}`);
console.log(`With Images:      ${stats.with_image}`);
console.log(`Coverage:         ${stats.coverage_percent.toFixed(2)}%`);
console.log("\nCharacter lookup:");

const targets = [
  "makima (chainsaw man)",
  "reze (chainsaw man)",
  "yoru (chainsaw man)",
  "power (chainsaw man)",
  "himeno (chainsaw man)",
  "mitaka asa",
  "ganyu (genshin impact)",
  "kirigiri kyoko",
  "mikasa ackerman",
  "echidna (re:zero)",
  "2b (nier:automata)",
  "a2 (nier:automata)",
  "eris greyrat",
  "elinalise dragonroad",
  "inoue orihime",
  "hyuuga hinata",
  "haruno sakura",
  "tojo kirumi",
  "asahina aoi",
  "kirijou mitsuru",
  "malenia blade of miquella",
  "ayla (chrono trigger)",
  "nakano ichika",
  "rem (re:zero)",
  "emilia (re:zero)",
  "bayonetta",
  "hatsune miku",
  "fern (sousou no frieren)",
  "princess zelda",
  "uzumaki himawari",
  "kugisaki nobara",
  "zen'in maki",
  "mei mei (jujutsu kaisen)",
  "lucy (cyberpunk)",
  "owari akane",
  "enoshima junko",
  "harukawa maki",
  "akamatsu kaede",
  "nanami chiaki",
  "sonia nevermind",
  "aegis (persona)",
  "takamaki anne",
  "sakura futaba",
  "takeba yukari",
  "niijima makoto",
  "okumura haru",
  "yoshizawa kasumi",
  "elizabeth (persona)",
  "takemi tae",
  "niijima sae",
  "tsunade (naruto)",
  "temari (naruto)",
  "terumi mei",
  "uchiha sarada",
  "kuchiki rukia",
  "shihouin yoruichi",
  "matsumoto rangiku",
  "gwen tennyson",
  "kurotsuchi nemu",
  "monika (doki doki literature club)",
  "natsuki (doki doki literature club)",
  "yuri (doki doki literature club)",
  "sayori (doki doki literature club)",
];

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
      console.log(
        `[${r.name}] -> ${r.image_url ? r.image_url : "NULL (No image fetched)"}`,
      );
    }
  }
}
