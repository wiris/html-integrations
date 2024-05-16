import { execSync } from "child_process";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let x1 = "unknown",
  x2 = "unknown";

// Retrieve GitHub branch and commit hash
x1 = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
x2 = execSync("git rev-parse --short HEAD").toString().trim();

// Converting JS object to JSON string
var jsonData = JSON.stringify({ branch: x1, hash: x2 });

// Get current directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write data in json file.
fs.writeFile(path.join(__dirname, "git-data.json"), jsonData, (err) => {
  // In case of a error throw err.
  if (err) throw err;
});
