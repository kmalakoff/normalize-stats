import type { BigIntStats, Stats } from 'fs';

const kNsPerMsBigInt = typeof BigInt === 'undefined' ? 10 ** 6 : BigInt(10 ** 6);

export default function normalizeStats(stats: Stats | BigIntStats): Stats | BigIntStats {
  if (typeof stats.dev === 'bigint') {
    const bigStats = stats as BigIntStats;
    if (!bigStats.atimeNs) {
      bigStats.atimeNs = bigStats.atimeMs * (kNsPerMsBigInt as bigint);
      bigStats.mtimeNs = bigStats.mtimeMs * (kNsPerMsBigInt as bigint);
      bigStats.ctimeNs = bigStats.ctimeMs * (kNsPerMsBigInt as bigint);
      bigStats.birthtimeNs = bigStats.birthtimeMs * (kNsPerMsBigInt as bigint);
    }
  } else {
    if (!stats.atimeMs) {
      stats.atimeMs = stats.atime.valueOf() * 1000;
      stats.mtimeMs = stats.mtime.valueOf() * 1000;
      stats.ctimeMs = stats.ctime.valueOf() * 1000;
      stats.birthtimeMs = stats.birthtime ? stats.birthtime.valueOf() * 1000 : stats.mtimeMs;
    }
  }
  return stats;
}
