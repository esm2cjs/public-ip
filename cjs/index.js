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
var esm_exports = {};
__export(esm_exports, {
  CancelError: () => import_got2.CancelError,
  IpNotFoundError: () => import_core2.IpNotFoundError,
  publicIp: () => publicIp,
  publicIpv4: () => publicIpv4,
  publicIpv6: () => publicIpv6
});
module.exports = __toCommonJS(esm_exports);
var import_node_util = require("node:util");
var import_node_dgram = __toESM(require("node:dgram"));
var import_dns_socket = __toESM(require("dns-socket"));
var import_got = __toESM(require("@esm2cjs/got"));
var import_is_ip = require("@esm2cjs/is-ip");
var import_core = require("./core.js");
var import_core2 = require("./core.js");
var import_got2 = require("@esm2cjs/got");
const defaults = {
  timeout: 5e3,
  onlyHttps: false
};
const dnsServers = [
  {
    v4: {
      servers: [
        "208.67.222.222",
        "208.67.220.220",
        "208.67.222.220",
        "208.67.220.222"
      ],
      name: "myip.opendns.com",
      type: "A"
    },
    v6: {
      servers: [
        "2620:0:ccc::2",
        "2620:0:ccd::2"
      ],
      name: "myip.opendns.com",
      type: "AAAA"
    }
  },
  {
    v4: {
      servers: [
        "216.239.32.10",
        "216.239.34.10",
        "216.239.36.10",
        "216.239.38.10"
      ],
      name: "o-o.myaddr.l.google.com",
      type: "TXT",
      transform: (ip) => ip.replace(/"/g, "")
    },
    v6: {
      servers: [
        "2001:4860:4802:32::a",
        "2001:4860:4802:34::a",
        "2001:4860:4802:36::a",
        "2001:4860:4802:38::a"
      ],
      name: "o-o.myaddr.l.google.com",
      type: "TXT",
      transform: (ip) => ip.replace(/"/g, "")
    }
  }
];
const type = {
  v4: {
    dnsServers: dnsServers.map(({ v4: { servers, ...question } }) => ({
      servers,
      question
    })),
    httpsUrls: [
      "https://icanhazip.com/",
      "https://api.ipify.org/"
    ]
  },
  v6: {
    dnsServers: dnsServers.map(({ v6: { servers, ...question } }) => ({
      servers,
      question
    })),
    httpsUrls: [
      "https://icanhazip.com/",
      "https://api6.ipify.org/"
    ]
  }
};
const queryDns = (version, options) => {
  const data = type[version];
  const socket = (0, import_dns_socket.default)({
    retries: 0,
    maxQueries: 1,
    socket: import_node_dgram.default.createSocket(version === "v6" ? "udp6" : "udp4"),
    timeout: options.timeout
  });
  const socketQuery = (0, import_node_util.promisify)(socket.query.bind(socket));
  const promise = (async () => {
    let lastError;
    for (const dnsServerInfo of data.dnsServers) {
      const { servers, question } = dnsServerInfo;
      for (const server of servers) {
        if (socket.destroyed) {
          return;
        }
        try {
          const { name, type: type2, transform } = question;
          const dnsResponse = await socketQuery({ questions: [{ name, type: type2 }] }, 53, server);
          const {
            answers: {
              0: {
                data: data2
              }
            }
          } = dnsResponse;
          const response = (typeof data2 === "string" ? data2 : data2.toString()).trim();
          const ip = transform ? transform(response) : response;
          const method = version === "v6" ? import_is_ip.isIPv6 : import_is_ip.isIPv4;
          if (ip && method(ip)) {
            socket.destroy();
            return ip;
          }
        } catch (error) {
          lastError = error;
        }
      }
    }
    socket.destroy();
    throw new import_core.IpNotFoundError({ cause: lastError });
  })();
  promise.cancel = () => {
    socket.destroy();
  };
  return promise;
};
const queryHttps = (version, options) => {
  let cancel;
  const promise = (async () => {
    var _a;
    try {
      const requestOptions = {
        dnsLookupIpVersion: version === "v6" ? 6 : 4,
        retry: {
          limit: 0
        },
        timeout: {
          request: options.timeout
        }
      };
      const urls = [
        ...type[version].httpsUrls,
        ...(_a = options.fallbackUrls) != null ? _a : []
      ];
      let lastError;
      for (const url of urls) {
        try {
          const gotPromise = import_got.default.get(url, requestOptions);
          cancel = gotPromise.cancel;
          const response = await gotPromise;
          const ip = (response.body || "").trim();
          const method = version === "v6" ? import_is_ip.isIPv6 : import_is_ip.isIPv4;
          if (ip && method(ip)) {
            return ip;
          }
        } catch (error) {
          lastError = error;
          if (error instanceof import_got.CancelError) {
            throw error;
          }
        }
      }
      throw new import_core.IpNotFoundError({ cause: lastError });
    } catch (error) {
      if (!(error instanceof import_got.CancelError)) {
        throw error;
      }
    }
  })();
  promise.cancel = function() {
    return cancel.apply(this);
  };
  return promise;
};
const queryAll = (version, options) => {
  let cancel;
  const promise = (async () => {
    let response;
    const dnsPromise = queryDns(version, options);
    cancel = dnsPromise.cancel;
    try {
      response = await dnsPromise;
    } catch {
      const httpsPromise = queryHttps(version, options);
      cancel = httpsPromise.cancel;
      response = await httpsPromise;
    }
    return response;
  })();
  promise.cancel = cancel;
  return promise;
};
const publicIp = (0, import_core.createPublicIp)(publicIpv4, publicIpv6);
function publicIpv4(options) {
  options = {
    ...defaults,
    ...options
  };
  if (!options.onlyHttps) {
    return queryAll("v4", options);
  }
  if (options.onlyHttps) {
    return queryHttps("v4", options);
  }
  return queryDns("v4", options);
}
function publicIpv6(options) {
  options = {
    ...defaults,
    ...options
  };
  if (!options.onlyHttps) {
    return queryAll("v6", options);
  }
  if (options.onlyHttps) {
    return queryHttps("v6", options);
  }
  return queryDns("v6", options);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CancelError,
  IpNotFoundError,
  publicIp,
  publicIpv4,
  publicIpv6
});
//# sourceMappingURL=index.js.map
