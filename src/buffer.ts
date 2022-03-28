import type { BufferClass } from "./types.ts";

type BufferModules = {
  value?: BufferClass;
  listeners: Array<(Buffer: BufferClass) => void>;
  listen(callback: (Buffer: BufferClass) => void): void;
  setBuffer(Buffer: BufferClass): void;
  getBuffer(): BufferClass;
};

export const buffer: BufferModules = {
  value: undefined,
  listeners: [],
  listen(callback) {
    this.listeners.push(callback);
  },
  setBuffer(Buffer) {
    this.listeners.forEach((listener) => listener(Buffer));
    this.value = Buffer;
  },
  getBuffer() {
    if (!this.value) throw new Error("Buffer not set");
    return this.value;
  },
};
