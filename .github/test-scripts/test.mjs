import publicIp from "@esm2cjs/public-ip";
import assert from "assert";

assert(typeof publicIp.v4 === "function");
assert(typeof publicIp.v6 === "function");
