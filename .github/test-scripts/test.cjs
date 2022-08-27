const publicIp = require("@esm2cjs/public-ip").default;
const assert = require("assert");

assert(typeof publicIp.v4 === "function");
assert(typeof publicIp.v6 === "function");
