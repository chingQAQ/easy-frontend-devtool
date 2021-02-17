const { join } = require('path');
const { src, dest } = require('gulp');
const postcss = require('gulp-postcss');
const transform = require('gulp-transform');
const through = require('through');
const extractMediaQuery = require('postcss-extract-media-query');
const PATH = require('./config');
const option = { removeBOM: false, allowEmpty: true };
let mediaQuery = {};

const processors = [
  extractMediaQuery({
    output: {
      path: join(PATH.source, 'css'),
      // name: '[name]-[query].[ext]'
    },
    queries: mediaQuery,
    extractAll: false
  })
]

const preprocess = {
  through: content => {
    const match = /screen\s{1}and\s{1}\((.*)\)/gm;
    let find = content.match(match);
    mediaQuery = find.reduce((count, current) => {
      count['"' + current + '"'] = "media";
      return count;
    }, {});
    return content;
  }
}

function combineMediaQuery() {
  return src(join(PATH.source, 'css/style.css'), Object.assign({}, option))
    .pipe(transform('utf8', preprocess.through))
    .pipe(postcss(processors))
    .pipe(dest(join(PATH.source, 'css')))
}

module.exports = combineMediaQuery;
