const { tests } = require("../dist/test");

for (const test of tests) {
  if (test.ignore) {
    it.skip(test.name, test.fn);
  } else it(test.name, test.fn);
}
