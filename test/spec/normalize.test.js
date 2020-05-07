var assert = require('assert');
var generate = require('fs-generate');
var rimraf = require('rimraf');
var path = require('path');
var fs = require('fs');
var statsSpys = require('fs-stats-spys');

var normalizeStats = require('../..');

var DIR = path.resolve(path.join(__dirname, '..', 'data'));
var STRUCTURE = {
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

describe('normalize', function () {
  after(function (done) {
    rimraf(DIR, done);
  });
  beforeEach(function (done) {
    rimraf(DIR, function () {
      generate(DIR, STRUCTURE, done);
    });
  });

  it('should load stats', function (done) {
    var spys = statsSpys();

    fs.readdir(DIR, function (err, names) {
      assert.ok(!err);

      for (var index in names) {
        var smallStats = normalizeStats(fs.statSync(path.join(DIR, names[index])));

        assert.ok(typeof smallStats.dev !== 'undefined');
        assert.ok(typeof smallStats.mode !== 'undefined');
        assert.ok(typeof smallStats.nlink !== 'undefined');
        assert.ok(typeof smallStats.uid !== 'undefined');
        assert.ok(typeof smallStats.gid !== 'undefined');
        assert.ok(typeof smallStats.rdev !== 'undefined');
        assert.ok(typeof smallStats.blksize !== 'undefined');
        assert.ok(typeof smallStats.ino !== 'undefined');
        assert.ok(typeof smallStats.size !== 'undefined');
        assert.ok(typeof smallStats.blocks !== 'undefined');
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

  typeof BigInt === 'undefined' ||
    it('should initialize from with bigInt option', function (done) {
      var spys = statsSpys();

      fs.readdir(DIR, function (err, names) {
        assert.ok(!err);

        for (var index in names) {
          var bigStats = fs.lstatSync(path.join(DIR, names[index]), { bigint: true });

          bigStats = normalizeStats(bigStats);
          assert.ok(typeof bigStats.dev !== 'undefined');
          assert.ok(typeof bigStats.mode !== 'undefined');
          assert.ok(typeof bigStats.nlink !== 'undefined');
          assert.ok(typeof bigStats.uid !== 'undefined');
          assert.ok(typeof bigStats.gid !== 'undefined');
          assert.ok(typeof bigStats.rdev !== 'undefined');
          assert.ok(typeof bigStats.blksize !== 'undefined');
          assert.ok(typeof bigStats.ino !== 'undefined');
          assert.ok(typeof bigStats.size !== 'undefined');
          assert.ok(typeof bigStats.blocks !== 'undefined');
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
