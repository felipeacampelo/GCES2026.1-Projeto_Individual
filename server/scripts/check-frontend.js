var fs = require('fs');
var path = require('path');

var rootDir = path.resolve(__dirname, '..', '..');
var gameDir = path.join(rootDir, 'game');
var indexPath = path.join(gameDir, 'index.html');
var requiredFiles = [
  path.join(gameDir, 'src', 'mk.js'),
  path.join(gameDir, 'src', 'movement.js'),
  path.join(gameDir, 'styles', 'styles.css')
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

var indexHtml = fs.readFileSync(indexPath, 'utf8');

requiredFiles.forEach(function (filePath) {
  assert(fs.existsSync(filePath), 'Missing frontend asset: ' + path.relative(rootDir, filePath));
});

assert(indexHtml.indexOf('/socket.io/socket.io.js') !== -1, 'Frontend must load the Socket.IO client bundle');
assert(indexHtml.indexOf("gameType: 'network'") !== -1, 'Frontend must keep the network mode configuration');
