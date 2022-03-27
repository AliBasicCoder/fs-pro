const { tests } = require("../../dist/test");

for (const test of tests) {
  it(test.name, test.fn);
}
