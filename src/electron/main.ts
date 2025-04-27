import { app, BrowserWindow } from "electron";
import path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import {
  listDirectories,
  listFiles,
  createDir,
  writeFile,
  readFile,
  deleteElement,
  renameDir,
} from "./fileManager.js";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  ipcMainHandle("listFiles", (filePath?: string) => {
    console.log("listFiles called with path:", filePath);
    return listFiles(filePath);
  });

  ipcMainHandle("listDirectories", (filePath?: string) => {
    console.log("listDirectories called with path:", filePath);
    return listDirectories(filePath);
  });

  ipcMainHandle("createDir", (dirPath: string) => {
    console.log("createDir called with path:", dirPath);
    return createDir(dirPath);
  });

  ipcMainHandle(
    "writeFile",
    (filePath: string, fileName: string, data: string) => {
      console.log("writeFile called with path:", filePath);
      return writeFile(filePath, fileName, data);
    }
  );

  // @ts-expect-error TODO: Fix this type error
  ipcMainHandle("readFile", (filePath: string) => {
    console.log("readFile called with path:", filePath);
    return readFile(filePath);
  });

  ipcMainHandle("deleteFile", (filePath: string) => {
    console.log("deleteFile called with path:", filePath);
    return deleteElement(filePath);
  });

  ipcMainHandle(
    "renameDir",
    (directoryPath: string, oldName: string, newName: string) => {
      console.log(
        "renameDir called with path:",
        directoryPath,
        " and newName:",
        newName
      );
      return renameDir(directoryPath, oldName, newName);
    }
  );
});
