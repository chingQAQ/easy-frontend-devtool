const { src, dest, watch } = require('gulp');
const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');

const MUST_EXCLUDE = ['src/images/*.{jpg,png}'];
const SOURCES_FILE = ['dist/images/*.{jpg,png}'];

async function watchImg() {
  watch(MUST_EXCLUDE, imageOptimize);
}

async function imageOptimize () {
  const files = await imagemin(SOURCES_FILE, {
    destination: 'dist/images',
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
