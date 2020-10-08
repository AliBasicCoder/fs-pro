import type { BufferClass } from "./types.ts";

type BufferModules = {
  listeners: Array<(Buffer: BufferClass) => void>;
  listen(callback: (Buffer: BufferClass) => void): void;
  setBuffer(Buffer: BufferClass): void;
};

export const buffer: BufferModules = {
  listeners: [],
  listen(callback) {
    this.listeners.push(callback);
  },
  setBuffer(Buffer) {
    this.listeners.forEach(listener => listener(Buffer));
  }
};
