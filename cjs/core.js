var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var core_exports = {};
__export(core_exports, {
  IpNotFoundError: () => IpNotFoundError,
  createPublicIp: () => createPublicIp
});
module.exports = __toCommonJS(core_exports);
var import_aggregate_error = __toESM(require("@esm2cjs/aggregate-error"));
class IpNotFoundError extends Error {
  constructor(options) {
    super("Could not get the public IP address", options);
    this.name = "IpNotFoundError";
  }
}
function createPublicIp(publicIpv4, publicIpv6) {
  return function publicIp(options) {
    const ipv4Promise = publicIpv4(options);
    const ipv6Promise = publicIpv6(options);
    const promise = (async () => {
      try {
        const ipv6 = await ipv6Promise;
        ipv4Promise.cancel();
        return ipv6;
      } catch (ipv6Error) {
        if (!(ipv6Error instanceof IpNotFoundError)) {
          throw ipv6Error;
        }
        try {
          return await ipv4Promise;
        } catch (ipv4Error) {
          throw new import_aggregate_error.default([ipv4Error, ipv6Error]);
        }
      }
    })();
    promise.cancel = () => {
      ipv4Promise.cancel();
      ipv6Promise.cancel();
    };
    return promise;
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IpNotFoundError,
  createPublicIp
});
//# sourceMappingURL=core.js.map
