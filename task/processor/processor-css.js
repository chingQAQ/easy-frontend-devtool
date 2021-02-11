const { src, dest, watch } = require('gulp');
const cached = require('gulp-cached');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const renameFile = require('../rename');
const sprites = require('postcss-sprites');
const { posix, join, resolve, relative, parse } = require('path');
const fs = require('fs');
const through = require('through');
const configFile = resolve(__dirname, '..', '.config');
const config = fs.readFileSync(configFile, 'utf8');
const path = {
  dev: JSON.parse(config).dev,
  source: JSON.parse(config).source,
  cssSource: JSON.parse(config).source + '/css',
  imageSource: JSON.parse(config).source + '/images',
};
const spriteGroups = [];
const opts = {
  stylesheetPath: path.dev + '/sass/**/*.scss',
  spritePath: path.dev + '/images',
  groupBy: (image) => {
    const spriteGroup = image.url.split('_')[1].toString().slice(0, -4);
    if (image.url.indexOf(spriteGroup) >= 0) {
      console.log(`找到了 ${spriteGroup}`)
      return Promise.resolve(spriteGroup);
    } else {
      return Promise.reject();
    }
  },
  filterBy: (image) => {
    if (!/sprite/.test(image.url)) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  hooks: {
    onSaveSpritesheet: (opts, spritesheet) => {
      spriteGroups.push(
        posix.join(opts.spritePath, spritesheet.groups[0] + '.' + spritesheet.extension)
      )
      const fileName = spritesheet.groups.concat(spritesheet.extension).join('.');
      return join(opts.spritePath, fileName);
    },
    onUpdateRule: function (rule, token, image) {
      const imageBase = parse(image.spriteUrl).base
      const imageUrl = join(relative(path.cssSource, path.imageSource), imageBase);
      const backgroundImage = {
        type: 'decl',
        prop: 'background-image',
        value: 'url(' + imageUrl + ')'
      };
      token.cloneAfter(backgroundImage);
    }
  },
  verbose: true,
}
const SASS_FILE = [path.dev + '/sass/style-edit.scss'];
const processors = [
  autoprefixer(),
  sprites(opts),
]

sass.compiler = require('node-sass');

function writeImagePath() {
  return through(function write(chunk) {
    const devBase = parse(path.dev).base;
    const sourceBase = parse(path.source).base;
    if (spriteGroups.length > 0) {
      spriteGroups.forEach(item => {
        fs.createReadStream(item)
          .pipe(fs.createWriteStream(item.replace(devBase, sourceBase)))
      })
    }
  })
}

function cssCompiler() {
  return src(SASS_FILE)
    .pipe(cached('css'))
    .pipe(renameFile())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(writeImagePath())
    .pipe(dest(path.cssSource));
}

function watchCss() {
  watch(path.dev + '/sass/**/*.scss', cssCompiler);
}

module.exports = {
  cssCompiler, 
  watchCss,
  path
};
