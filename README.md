## normalize-stats

Normalize fs.Stats and fs.BigIntStats across versions of Node.js.

```bash
npm install normalize-stats
```

```
var assert = require('assert');
var normalize = require('normalize-stats');
var fs = require('fs');

var smallStats = normalize(fs.statSync(__dirname));

var bigStats = normalize(fs.lstatSync(__dirname, { bigint: true }));
```

`normalize` returns the same stats object after filling missing millisecond or nanosecond fields. The `{ bigint: true }` form requires a Node.js version that supports BigInt filesystem stats.
