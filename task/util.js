
const { existsSync } = require('fs');
const { join, posix, sep, resolve } = require('path');
const { platform } = require('os');
const isWin32 = platform() === 'win32';

function validPath(path) {
  const parse = path.split(posix.sep);
  const result = parse.filter(i => i !== null).join('/');
  if (result.length) return resolve(result);
  else {
    console.error('路徑驗證錯誤，terminal關閉', result);
    process.exit();
  }
}

function hasPath(path) {
  const existence = existsSync(path);
  return existence;
}

function transformToGlobPath(path) {
  return isWin32 ? path.split(sep).join('/') : path;
}

module.exports = {
  hasPath,
  validPath,
  transformToGlobPath
}
