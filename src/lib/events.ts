import EventEmitter from "eventemitter3";

export interface AppEvents {
  nextFile: () => void;
  prevFile: () => void;
  resetCaption: () => void;
  saveFile: () => void;
  saveAllFiles: () => void;
}

export const appEvents = new EventEmitter<AppEvents>();
