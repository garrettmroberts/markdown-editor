import fs from "fs";
import path from "path";
import { app } from "electron";

export function listDirectories(filePath?: string): string[] {
  const documentsPath = path.join(
    app.getPath("documents"),
    "mdNotes",
    filePath || ""
  );

  if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
  }

  const files = fs.readdirSync(documentsPath);
  const directories = files.filter((file) => {
    const fileStat = fs.statSync(path.join(documentsPath, file));
    return fileStat.isDirectory();
  });

  return directories;
}

export function listFiles(filePath?: string): string[] {
  const documentsPath = path.join(
    app.getPath("documents"),
    "mdNotes",
    filePath || ""
  );

  if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
  }

  let files = fs.readdirSync(documentsPath);
  files = files.filter((file) => {
    const fileStat = fs.statSync(path.join(documentsPath, file));
    return fileStat.isFile();
  });
  return files;
}

export function createDir(directoryPath: string): boolean {
  const documentsPath = path.join(
    app.getPath("documents"),
    "mdNotes",
    directoryPath
  );

  if (!fs.existsSync(documentsPath)) {
    fs.mkdirSync(documentsPath, { recursive: true });
    return true;
  } else {
    return false;
  }
}

export function writeFile(
  filePath: string,
  fileName: string,
  data?: string
): boolean {
  try {
    const documentsPath = path.join(
      app.getPath("documents"),
      "mdNotes",
      filePath
    );

    const filePathToCreate = path.join(documentsPath, fileName);
    fs.writeFileSync(filePathToCreate, data || "");

    return true;
  } catch (err) {
    console.error("Error creating file:", err);
    return false;
  }
}

export function readFile(filePath: string): string | undefined {
  try {
    const documentsPath = path.join(
      app.getPath("documents"),
      "mdNotes",
      filePath
    );

    const file = fs.readFileSync(documentsPath);
    return file.toString();
  } catch (err) {
    console.error("Error reading file:", err);
    return undefined;
  }
}
