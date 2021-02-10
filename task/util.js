
const { existsSync } = require('fs');
const { join, posix, sep, resolve } = require('path');

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

module.exports = {
  hasPath,
  validPath,
}
