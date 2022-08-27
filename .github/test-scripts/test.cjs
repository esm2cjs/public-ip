const { publicIp, publicIpv4, publicIpv6 } = require("@esm2cjs/public-ip");
const assert = require("assert");

assert(typeof publicIp === "function");
assert(typeof publicIpv4 === "function");
assert(typeof publicIpv6 === "function");
