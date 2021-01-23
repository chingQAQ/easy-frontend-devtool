const { src, dest, watch } = require('gulp');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const through = require('through');
const sourcemaps = require('gulp-sourcemaps');
const lazypipe = require('lazypipe');
const cached = require('gulp-cached');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
sass.compiler = require('node-sass');

// js
const MUST_EXCLUDE = ['!**/*.min.js', '!gulpfile.js', '!node_modules/**'];
const EXPORTS_FILE = (option = {}) => ['src/js/**/*.js'].concat(MUST_EXCLUDE, option.moreFiles || []);
const OPTION = { base: 'src', removeBOM: false, allowEmpty: true };

// sass
const SASS_FILE = ['src/sass/style-edit.scss'];

const postcssPlugin = [
  autoprefixer(),
]

function compilerSass() {
  return src(SASS_FILE)
    .pipe(cached('css'))
    .pipe(renameFile())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(postcssPlugin))
    .pipe(dest('./dist/css'))
}

const renameFile = () => lazypipe()
  .pipe(rename, path => {
    const isSass = /.s[ac]ss$/i.test(path.extname);
    isSass ? path.basename = 'style-source' : path.basename += '.min';
  } 
  )()

const optimizeJs = (option = {}) => lazypipe()
  .pipe(option.production ? through : sourcemaps.init)
  .pipe(babel, {
    presets: ['@babel/preset-env', 'minify'],
    comments: false,
    shouldPrintComment: val => /(^!|@preserve|@license|@cc_on)/i.test(val),
  })
  .pipe(option.production ? through : sourcemaps.write, 'source-map/')
  ()

function watchJs() {
  watch(EXPORTS_FILE(), minJs)
}

async function minJs() {
  return src(EXPORTS_FILE(), Object.assign({}, OPTION))
    .pipe(cached('js'))
    .pipe(renameFile())
    .pipe(optimizeJs({ production: false }))
    .on('error', err => {
      console.log(err)
    })
    .pipe(dest('./dist/js'))
}

module.exports = Object.assign({},
  {
    'watch:js': watchJs,
    'min:css': compilerSass,
  },
)
