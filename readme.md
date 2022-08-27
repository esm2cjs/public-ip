# @esm2cjs/public-ip

This is a fork of https://github.com/sindresorhus/public-ip, but automatically patched to support ESM **and** CommonJS, unlike the original repository.
This fork does NOT include browser support, only Node.js.

## Install

You can use an npm alias to install this package under the original name:

```
npm i public-ip@npm:@esm2cjs/public-ip
```

```jsonc
// package.json
"dependencies": {
    "public-ip": "npm:@esm2cjs/public-ip"
}
```

but `npm` might dedupe this incorrectly when other packages depend on the replaced package. If you can, prefer using the scoped package directly:

```
npm i @esm2cjs/public-ip
```

```jsonc
// package.json
"dependencies": {
    "@esm2cjs/public-ip": "^ver.si.on"
}
```

## Usage

```js
// Using ESM import syntax
import publicIp from "@esm2cjs/public-ip";

// Using CommonJS require()
const publicIp = require("@esm2cjs/public-ip").default;
```

> **Note:**
> Because the original module uses `export default`, you need to append `.default` to the `require()` call.

For more details, please see the original [repository](https://github.com/sindresorhus/public-ip).

## Sponsoring

To support my efforts in maintaining the ESM/CommonJS hybrid, please sponsor [here](https://github.com/sponsors/AlCalzone).

To support the original author of the module, please sponsor [here](https://github.com/sindresorhus/public-ip).
