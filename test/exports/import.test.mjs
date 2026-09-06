import assert from 'assert';
import normalizeStats from 'normalize-stats';

describe('exports .mjs', () => {
  it('default', () => {
    assert.equal(typeof normalizeStats, 'function');
  });
});
