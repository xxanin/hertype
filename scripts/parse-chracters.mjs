import { readFileSync, writeFileSync } from "fs";

const raw = readFileSync("characters_str_tags_danbooru15000.txt", "utf-8");

const characters = raw
  .split("\n")
  .filter(Boolean)
  .map(line => {
    const [name, series, genderTag, ...tags] = line
      .split(",")
      .map(s => s.trim());
    return { name: name.replace(/\\/g, ""), series, genderTag, tags };
  })
  .filter(c => c.genderTag === "1girl");

console.log(`Parsed ${characters.length} girl characters`);
writeFileSync("characters.json", JSON.stringify(characters, null, 2));
