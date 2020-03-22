/* eslint-disable no-console */
const { Dir } = require(".");

const nd = new Dir(__dirname, "node_modules");

const time = Date.now();
nd.delete();
console.log(Date.now() - time);
