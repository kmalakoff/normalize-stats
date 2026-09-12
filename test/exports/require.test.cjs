const assert = require('assert');
const normalizeStats = require('normalize-stats');

describe('exports .cjs', () => {
  it('default', () => {
    assert.equal(typeof normalizeStats, 'function');
  });
});
