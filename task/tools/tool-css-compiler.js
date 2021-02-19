const fs = require('fs');
const { posix, join, relative, parse, sep } = require('path');
const { src, dest, watch } = require('gulp');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const sprites = require('postcss-sprites');
const combineMediaQuery = require('postcss-combine-media-query');
const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const through = require('through');
const { hasPath, transformToGlobPath } = require('../util');
const isProduction = process.env.NODE_ENV === 'production';
const PATH = require('./config');
const option = { removeBOM: false, allowEmpty: true };
const sourceMapPath = join('..', 'source-map', 'css');
const watchFiles = [
  transformToGlobPath(join(PATH.dev, 'sass'))
];
const spriteGroups = [];
const spriteSettings = {
  stylesheetPath: transformToGlobPath(join(PATH.dev, 'sass', '**', '*.scss')),
  spritePath: join(PATH.dev, 'images'),
  groupBy: (image) => {
    const spriteGroup = image.url.split('_')[1].toString().slice(0, -4);
    if (image.url.indexOf(spriteGroup) >= 0) {
      console.log(`[sprite] group ${spriteGroup}`)
      return Promise.resolve(spriteGroup);
    } else {
      return Promise.reject();
    }
  },
  filterBy: (image) => {
    if (!/sprite/.test(image.url)) {
      return Promise.reject();
    };
    return Promise.resolve();
  },
  hooks: {
    onSaveSpritesheet: (opts, spritesheet) => {
      spriteGroups.push(
        join(opts.spritePath, spritesheet.groups[0] + '.' + spritesheet.extension)
      )
      const fileName = spritesheet.groups.concat(spritesheet.extension).join('.');
      return join(opts.spritePath, fileName);
    },
    onUpdateRule: function (rule, token, image) {
      const imageBase = parse(image.spriteUrl).base
      const imageUrl = join(relative(PATH.cssSource, PATH.imageSource), imageBase).split(sep).join('/');
      const checkNaN = number => isNaN(number) ? 0 : number;
      const backgroundSize = {
        width: checkNaN((image.spriteWidth / image.coords.width) * 100),
        height: checkNaN((image.spriteHeight / image.coords.height) * 100),
      }
      const backgroundPosition = {
        x: checkNaN((image.coords.x / (image.spriteWidth - image.coords.width)) * 100),
        y: checkNaN((image.coords.y / (image.spriteHeight - image.coords.height)) * 100),
      }
      const setBackgroundImage = {
        type: 'decl',
        prop: 'background-image',
        value: 'url(' + imageUrl + ')'
      };
      const setBackgroundSize = {
        type: 'decl',
        prop: 'background-size',
        value: `${backgroundSize.width}% ${backgroundSize.height}%`
      };
      const setBackgroundPosition = {
        type: 'decl',
        prop: 'background-position',
        value: `${backgroundPosition.x}% ${backgroundPosition.y}%`
      };

      token
        .cloneAfter(setBackgroundImage)
        .cloneAfter(setBackgroundSize)
        .cloneAfter(setBackgroundPosition);
    }
  },
  verbose: true,
};

const sassFiles = [join(PATH.dev, 'sass', 'style-edit.scss')];
const processors = [
  autoprefixer(),
  sprites(spriteSettings),
  combineMediaQuery(),
];

sass.compiler = require('node-sass'); 

const stream = {
  rename: () => rename(path => {
    path.basename = 'style';
    if (isProduction) path.basename += '.min';
  }),
  writeImagePath: () => through(function write(chunk) {
    const devBase = parse(PATH.dev).base;
    const sourceBase = PATH.source.split(process.cwd())[1];
    const isExist = hasPath(PATH.imageSource);
    if (!isExist) fs.mkdirSync(PATH.imageSource);
    if (spriteGroups.length > 0) {
      spriteGroups.forEach(item => {
        fs.createReadStream(item)
          .pipe(fs.createWriteStream(item.replace(devBase, sourceBase)))
      })
    }
    this.queue(chunk);
  }),
  lint: () => through(async function write(chunk) {
    this.pause();
    const data = await stylelint.lint({
      files: transformToGlobPath(join(PATH.dev, 'sass', '**', '*.scss')),
      formatter: "verbose"
    })
    if (data.errored === true) {
      console.log('[stylelint] 發現錯誤' + data.output)
      process.exit();
    }
    console.log('[stylelint] 驗證完成')
    this
      .resume()
      .emit('data', chunk);
  }),
};

function cssCompiler() {
  return src(sassFiles, Object.assign({}, option))
    .pipe(stream.lint())
    .pipe(stream.rename())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(stream.writeImagePath())
    .pipe(gulpif(isProduction, cssnano({preset: ['advanced']})))
    .pipe(sourcemaps.write(sourceMapPath))
    .pipe(dest(PATH.cssSource));
};

function watchCss() {
  console.log('[watch css] sass files listening...')
  watch(watchFiles, cssCompiler);
};

module.exports = {
  cssCompiler, 
  watchCss,
};
