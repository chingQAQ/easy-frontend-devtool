const { watch } = require('gulp');
const { path } = require('./processor-css');
const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');

const MUST_EXCLUDE = [ path.dev + '/images/*.{jpg,png}'];
const SOURCES_FILE = [ path.imageSource + '/*.{jpg,png}'];

async function watchImg() {
  watch(MUST_EXCLUDE, imageOptimize);
}

async function imageOptimize () {
  const files = await imagemin(SOURCES_FILE, {
    destination: path.imageSource,
    plugins: [
      imageminJpegRecompress({
        quality: 'veryhigh',
      }),
      imageminPngquant({
        quality: [0.7, 0.95],
      }),
    ]
  });
  console.log(`壓縮了 ${files.length}張 圖片`);
}

module.exports = { imageOptimize, watchImg };
