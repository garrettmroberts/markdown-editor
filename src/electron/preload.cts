const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  listDirectories: (directoryPath?: string) => {
    return electron.ipcRenderer.invoke("listDirectories", directoryPath);
  },
  listFiles: (filePath?: string) => {
    return electron.ipcRenderer.invoke("listFiles", filePath);
  },
  readFile: (filePath: string) => {
    return electron.ipcRenderer.invoke("readFile", filePath);
  },
  writeFile: (filePath: string, fileName: string, fileContents: string) => {
    return electron.ipcRenderer.invoke(
      "writeFile",
      filePath,
      fileName,
      fileContents
    );
  },
  createDir: (directoryPath: string) => {
    return electron.ipcRenderer.invoke("createDir", directoryPath);
  },
  deleteElement: (filePath: string) => {
    return electron.ipcRenderer.invoke("deleteFile", filePath);
  },
  renameDir: (directoryPath: string, oldName: string, newName: string) => {
    return electron.icpRenderer.invoke(
      "renameDir",
      directoryPath,
      oldName,
      newName
    );
  },
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  electron.ipcRenderer.on(key, (_: any, payload: EventPayloadMapping[Key]) => {
    callback(payload);
  });
}
