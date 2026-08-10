'use strict';

var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var spawnSync = require('node:child_process').spawnSync;
var test = require('node:test');

test('the CLI parses a JavaScript file and writes valid graph artifacts', function() {
  var workingDirectory = fs.mkdtempSync(path.join(__dirname, '.tmp-code-art-'));
  fs.mkdirSync(path.join(workingDirectory, 'views'));

  try {
    var result = spawnSync(
      process.execPath,
      [path.join(__dirname, '..', 'code-art.js'), path.join(__dirname, 'abs.js')],
      { cwd: workingDirectory, encoding: 'utf8' }
    );

    assert.equal(result.status, 0, result.stderr || result.stdout);

    [
      'functionList.json',
      'grapho.json',
      'nodes.json',
      'links.json',
      path.join('views', 'list.json'),
      path.join('views', 'edges.json'),
      path.join('views', 'edgesLog.json'),
      path.join('views', 'finalList.json')
    ].forEach(function(relativePath) {
      var content = fs.readFileSync(path.join(workingDirectory, relativePath), 'utf8');
      assert.doesNotThrow(function() { JSON.parse(content); }, relativePath);
    });
  } finally {
    fs.rmSync(workingDirectory, { recursive: true, force: true });
  }
});
