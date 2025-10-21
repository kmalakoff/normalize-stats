import assert from 'assert';
import fs, { type BigIntStats } from 'fs';
import generate from 'fs-generate';
import statsSpys from 'fs-stats-spys';
import normalizeStats from 'normalize-stats';
import path from 'path';
import rimraf2 from 'rimraf2';
import url from 'url';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TEST_DIR = path.join(path.join(__dirname, '..', '..', '.tmp', 'test'));
const STRUCTURE = {
  file1: 'a',
  file2: 'b',
  dir1: null,
  'dir2/file1': 'c',
  'dir2/file2': 'd',
  'dir3/dir4/file1': 'e',
  'dir3/dir4/dir5': null,
  filelink1: '~dir3/dir4/file1',
  'dir3/filelink2': '~dir2/file1',
};

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);

describe('normalize', () => {
  after((done) => {
    rimraf2(TEST_DIR, { disableGlob: true }, done);
  });
  beforeEach((done) => {
    rimraf2(TEST_DIR, { disableGlob: true }, () => {
      generate(TEST_DIR, STRUCTURE, (err) => {
        done(err);
      });
    });
  });

  it('should load stats', (done) => {
    const spys = statsSpys();

    fs.readdir(TEST_DIR, (err, names) => {
      if (err) {
        done(err.message);
        return;
      }

      for (const index in names) {
        const smallStats = normalizeStats(fs.statSync(path.join(TEST_DIR, names[index])));

        assert.ok(typeof smallStats.dev !== 'undefined');
        assert.ok(typeof smallStats.mode !== 'undefined');
        assert.ok(typeof smallStats.nlink !== 'undefined');
        assert.ok(typeof smallStats.uid !== 'undefined');
        assert.ok(typeof smallStats.gid !== 'undefined');
        assert.ok(typeof smallStats.rdev !== 'undefined');
        isWindows || assert.ok(typeof smallStats.blksize !== 'undefined');
        assert.ok(typeof smallStats.ino !== 'undefined');
        assert.ok(typeof smallStats.size !== 'undefined');
        isWindows || assert.ok(typeof smallStats.blocks !== 'undefined');
        assert.ok(typeof smallStats.atime !== 'undefined');
        assert.ok(typeof smallStats.atimeMs !== 'undefined');
        assert.ok(typeof smallStats.mtime !== 'undefined');
        assert.ok(typeof smallStats.mtimeMs !== 'undefined');
        assert.ok(typeof smallStats.ctime !== 'undefined');
        assert.ok(typeof smallStats.ctimeMs !== 'undefined');
        !smallStats.birthtime || assert.ok(typeof smallStats.birthtimeMs !== 'undefined');

        spys(smallStats);
      }

      assert.equal(spys.callCount, 6);
      assert.equal(spys.dir.callCount, 3);
      assert.equal(spys.file.callCount, 3);
      assert.equal(spys.link.callCount, 0);
      done();
    });
  });

  ['undefined', 'function'].indexOf(typeof BigInt) >= 0 ||
    it('should initialize from with bigInt option', (done) => {
      const spys = statsSpys();

      fs.readdir(TEST_DIR, (err, names) => {
        if (err) {
          done(err.message);
          return;
        }

        for (const index in names) {
          const bigStats_ = fs.lstatSync(path.join(TEST_DIR, names[index]), { bigint: true });

          const bigStats = normalizeStats(bigStats_) as BigIntStats;
          assert.ok(typeof bigStats.dev !== 'undefined');
          assert.ok(typeof bigStats.mode !== 'undefined');
          assert.ok(typeof bigStats.nlink !== 'undefined');
          assert.ok(typeof bigStats.uid !== 'undefined');
          assert.ok(typeof bigStats.gid !== 'undefined');
          assert.ok(typeof bigStats.rdev !== 'undefined');
          isWindows || assert.ok(typeof bigStats.blksize !== 'undefined');
          assert.ok(typeof bigStats.ino !== 'undefined');
          assert.ok(typeof bigStats.size !== 'undefined');
          isWindows || assert.ok(typeof bigStats.blocks !== 'undefined');
          assert.ok(typeof bigStats.atime !== 'undefined');
          assert.ok(typeof bigStats.atimeMs !== 'undefined');
          assert.ok(typeof bigStats.atimeNs !== 'undefined');
          assert.ok(typeof bigStats.mtime !== 'undefined');
          assert.ok(typeof bigStats.mtimeMs !== 'undefined');
          assert.ok(typeof bigStats.mtimeNs !== 'undefined');
          assert.ok(typeof bigStats.ctime !== 'undefined');
          assert.ok(typeof bigStats.ctimeMs !== 'undefined');
          assert.ok(typeof bigStats.birthtimeMs !== 'undefined');
          assert.ok(typeof bigStats.birthtimeNs !== 'undefined');

          spys(bigStats);
        }

        assert.equal(spys.callCount, 6);
        assert.equal(spys.dir.callCount, 3);
        assert.equal(spys.file.callCount, 2);
        assert.equal(spys.link.callCount, 1);

        done();
      });
    });
});
