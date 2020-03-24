const msgs = {
  STF: "directory supposed to be a file",
  STD: "file supposed to be a directory",
  DDE: "directory does not exits",
  FDE: "file does not exits",
  IN: "Invalid Input",
  WE: "Have wrong extension",
  IDF: "Invalid Directory Found",
  IFF: "Invalid File Found"
};

export class fsProErr extends Error {
  constructor(
    public code: "STF" | "STD" | "DDE" | "FDE" | "IN" | "WE" | "IDF" | "IFF",
    public path: string
  ) {
    super(`${msgs[code]} at: ${path}`);
  }
}
