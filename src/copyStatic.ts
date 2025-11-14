import fs from "fs";
import path from "path";

const src = path.join(__dirname, "../src/templates"); // source templates
const dest = path.join(__dirname, "templates"); // copy to dist/templates

if (!fs.existsSync(src)) {
  console.error("❌ Source templates folder does not exist:", src);
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });
fs.cpSync(src, dest, { recursive: true });

console.log("✅ Templates copied from src → dist");
