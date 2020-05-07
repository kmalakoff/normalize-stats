## normalize-stats

Normalize fs.Stats and fs.BigIntStats across versions of Node.js.

```
var assert = require('assert');
var normalize = require('normalize-stats');
var fs = require('fs');

var smallStats = normalize(fs.statSync(__dirname));

var bigStats = normalize(fs.lstatSync(__dirname, { bigint: true }));
```
