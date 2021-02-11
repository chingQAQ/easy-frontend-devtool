const { src, dest, watch } = require('gulp');
const babel = require('gulp-babel');
const lazypipe = require('lazypipe');
const cached = require('gulp-cached');
const sourcemaps = require('gulp-sourcemaps');
const renameFile = require('../rename');
const { resolve } = require('path');
const fs = require('fs');
const configFile = resolve(__dirname, '..', '.config');
const config = fs.readFileSync(configFile, 'utf8');
const path = {
  dev: JSON.parse(config).dev,
  source: JSON.parse(config).source
};

const EXPORTS_FILE = [path.dev + '/js/**/*.js'];
const OPTION = { base: path.dev, removeBOM: false, allowEmpty: true };

const optimizeJs = (option = {}) => lazypipe()
  .pipe(sourcemaps.init)
  .pipe(babel, {
    presets: ['@babel/preset-env', 'minify'],
    comments: false,
    shouldPrintComment: val => /(^!|@preserve|@license|@cc_on)/i.test(val),
  })
  .pipe(sourcemaps.write, 'source-map/')
  ()

function minJs() {
  return src(EXPORTS_FILE, Object.assign({}, OPTION))
    .pipe(cached('js'))
    .pipe(renameFile())
    .pipe(optimizeJs())
    .on('error', err => {
      console.log(err)
    })
    .pipe(dest(path.source))
}

function watchJs() {
  watch(EXPORTS_FILE, minJs);
}

module.exports = {
  minJs,
  watchJs
};
