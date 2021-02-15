const { resolve } = require('path');
const { readFileSync } = require('fs');
const CONFIG_FILE = resolve(__dirname, '..', '.config');
const CONFIG = readFileSync(CONFIG_FILE, 'utf8');
const PATH = {
  dev: JSON.parse(CONFIG).dev,
  source: JSON.parse(CONFIG).source,
  cssSource: JSON.parse(CONFIG).source + '/css',
  imageSource: JSON.parse(CONFIG).source + '/images',
};

module.exports = PATH;