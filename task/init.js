const { hasPath } = require('./util');
const generateConfig = require('./generate-config');
const generateDirectory = require('./generate-directory');
const { join, posix, resolve } = require('path');
const configPath = resolve(__dirname, '.config');

if (!hasPath(configPath)) {
  generateConfig();
} else {
  generateDirectory();
}
