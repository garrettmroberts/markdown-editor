import fs from "fs";
export function listFiles() {
  const files = fs.readdirSync("./");
  return files;
}
