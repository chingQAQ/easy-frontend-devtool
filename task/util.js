
const { existsSync } = require('fs');
const { join, posix } = require('path');

function validPath(path) {
  const matchSlash = path.match('/');
  if (matchSlash === null || matchSlash.index <= 0) {
    return null;
  }
  return path;
}

function hasPath(path) {
  const existence = existsSync(path);
  return existence;
}

module.exports = {
  hasPath,
  validPath,
}
