type EventPayloadMapping = {
  listFiles: string[];
  listDirectories: string[];
  readFile: string;
  createDir: string;
  writeFile: boolean;
};

interface Window {
  electron: {
    listFiles: (dirPath?: string) => Promise<string[]>;
    listDirectories: (dirPath?: string) => Promise<string[]>;
    readFile: (filePath: string) => Promise<string>;
    createDir: (dirPath: string) => Promise<string>;
    writeFile(
      filePath: string,
      fileName: string,
      fileContents: string
    ): boolean;
    deleteElement: (filePath: string) => Promise<boolean>;
    renameDir: (
      dirPath: string,
      oldName: string,
      newName: string
    ) => Promise<boolean>;
  };
}
