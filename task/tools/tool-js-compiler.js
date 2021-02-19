const { join } = require('path');
const { src, dest, watch } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const cached = require('gulp-cached');
const babel = require('gulp-babel');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const minify = require("gulp-babel-minify");
const { transformToGlobPath } = require('../util');
const isProduction = process.env.NODE_ENV === 'production';
const PATH = require('./config');
const watchFiles = [
  transformToGlobPath(join(PATH.dev, 'js', '**', '*.js'))
];
const option = { base: PATH.dev, removeBOM: false, allowEmpty: true };
const minifyOption = {
  removeConsole: true,
  removeDebugger: true
};
const bebelOption = {
  presets: ['@babel/preset-env'],
  comments: false,
  shouldPrintComment: val => /(^!|@preserve|@license|@cc_on)/i.test(val),
};
const sourceMapPath = 'source-map/';

const stream = {
  rename: () => rename(path => isProduction ? path.basename += '.min' : ''),
}

function minJs() {
  return src(watchFiles, Object.assign({}, option))
    .pipe(cached('js'))
    .pipe(stream.rename())
    .pipe(sourcemaps.init())
    .pipe(babel(bebelOption))
    .pipe(gulpif(isProduction, minify(minifyOption)))
    .pipe(sourcemaps.write(sourceMapPath))
    .pipe(dest(PATH.source))
}

function watchJs() {
  console.log('[watch Js] Js files listening...')
  watch(watchFiles, minJs);
}

module.exports = {
  minJs,
  watchJs
};
