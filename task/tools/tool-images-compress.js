const PATH = require('./config');
const { join } = require('path');
const { watch } = require('gulp');
const imagemin = require('imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const { transformToGlobPath } = require('../util');
const destination = PATH.imageSource;
const watchFiles = [
  transformToGlobPath(join(PATH.dev, 'images', '*.{jpg,png}'))
];
const compressFiles = [
  transformToGlobPath(join(destination, '/*.{jpg,png}'))
];
async function watchImg() {
  watch(watchFiles, imageOptimize);
}

async function imageOptimize () {
  const files = await imagemin(compressFiles, {
    destination,
    plugins: [
      imageminJpegRecompress({
        quality: 'veryhigh',
      }),
      imageminPngquant({
        quality: [0.7, 0.95],
      }),
    ]
  });
  console.log(`壓縮了 ${files.length} 張圖片`);
}

module.exports = { imageOptimize, watchImg };
