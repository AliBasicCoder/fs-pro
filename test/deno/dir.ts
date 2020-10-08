import { Dir } from "../../mod.ts";
import {} from "https://deno.land/std@0.73.0/testing/asserts.ts";
import { checkDirData } from "./shared.ts";

Deno.test({
  name: "Dir: have write data",
  fn() {
    const path = Deno.makeTempDirSync();
    const dir = new Dir(path);
    checkDirData(dir, path);
  }
});
