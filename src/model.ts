interface modelFileObj {
  isFile: true;
  ext: string;
}

interface modelData {
  [key: string]: modelFileObj | modelData;
}

export class Model {
  public static File(ext: string): modelFileObj {
    return {
      isFile: true,
      ext
    };
  }

  constructor(public data: modelData) {}
}
