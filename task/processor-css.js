const { src, dest, watch } = require('gulp');
const cached = require('gulp-cached');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const renameFile = require('./rename');
const sprites = require('postcss-sprites');
const path = require('path');
const through = require('through');
const fs = require('fs');
const spriteGroups = [];
const opts = {
  stylesheetPath: './src/sass/**/*.scss',
  spritePath: './src/images',
  groupBy: (image) => {
    const spriteGroup = image.url.split('_')[1].toString().slice(0, -4);
    debugger;
    if (image.url.indexOf(spriteGroup) >= 0) {
      console.log(`找到了 ${spriteGroup}`)
      return Promise.resolve(spriteGroup);
    } else {
      return Promise.reject();
    }
  },
  filterBy: (image) => {
    debugger;
    if (!/sprite/.test(image.url)) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  hooks: {
    onSaveSpritesheet: (opts, spritesheet) => {
      debugger;
      spriteGroups.push(
        path.posix.join(opts.spritePath, spritesheet.groups[0] + '.' + spritesheet.extension)
      )
      const fileName = spritesheet.groups.concat(spritesheet.extension).join('.');
      return path.join(opts.spritePath, fileName);
    },
  },
  verbose: true,
}

sass.compiler = require('node-sass');
const SASS_FILE = ['src/sass/style-edit.scss'];

const processors = [
  autoprefixer(),
  sprites(opts),
]

function cssCompiler() {
  return src(SASS_FILE)
    .pipe(cached('css'))
    .pipe(renameFile())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(
      through(
        function write(data) {
          if (spriteGroups.length > 0) {
            spriteGroups.forEach(item => {
              fs.createReadStream(item)
                .pipe(fs.createWriteStream(item.replace('src', 'dist')))
            })
          }
          this.queue(data);
        },
        function end() {
          this.queue(null);          
        }
      )
    )
    .pipe(dest('./dist/css'))
}

module.exports = cssCompiler;
