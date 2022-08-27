import { publicIp, publicIpv4, publicIpv6 } from "@esm2cjs/public-ip";
import assert from "assert";

assert(typeof publicIp === "function");
assert(typeof publicIpv4 === "function");
assert(typeof publicIpv6 === "function");
