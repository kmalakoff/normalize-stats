"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return normalizeStats;
    }
});
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var kNsPerMsBigInt = typeof BigInt === 'undefined' ? Math.pow(10, 6) : BigInt(Math.pow(10, 6));
function normalizeStats(stats) {
    if (_type_of(stats.dev) !== 'bigint') {
        if (!stats.atimeMs) {
            stats.atimeMs = stats.atime.valueOf() * 1000;
            stats.mtimeMs = stats.mtime.valueOf() * 1000;
            stats.ctimeMs = stats.ctime.valueOf() * 1000;
            stats.birthtimeMs = stats.birthtime ? stats.birthtime.valueOf() * 1000 : stats.mtimeMs;
        }
    } else {
        if (!stats.atimeNs) {
            stats.atimeNs = stats.atimeMs * kNsPerMsBigInt;
            stats.mtimeNs = stats.mtimeMs * kNsPerMsBigInt;
            stats.ctimeNs = stats.ctimeMs * kNsPerMsBigInt;
            stats.birthtimeNs = stats.birthtimeMs * kNsPerMsBigInt;
        }
    }
    return stats;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }