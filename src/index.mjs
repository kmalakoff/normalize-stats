const kNsPerMsBigInt = typeof BigInt === 'undefined' ? 10 ** 6 : BigInt(10 ** 6);

export default function normalizeStats(stats) {
  if (typeof stats.dev !== 'bigint') {
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
