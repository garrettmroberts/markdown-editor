import { ipcMain, WebContents } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: string,
  handler: (...args: any) => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (_event, ...args) => handler(...args));
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: string,
  webContents: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContents.send(key, payload);
}
