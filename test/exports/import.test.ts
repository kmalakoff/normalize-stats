import assert from 'assert';
import normalizeStats from 'normalize-stats';

describe('exports .ts', () => {
  it('default', () => {
    assert.equal(typeof normalizeStats, 'function');
  });
});
