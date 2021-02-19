const {
  js: { watchJs, minJs },
  css: { cssCompiler, watchCss },
  images: { imageOptimize, watchImg },
  server: webServer,
} = require('./task/tools');
const { series, parallel } = require('gulp');

module.exports = Object.assign({},
  {
    'min:js': minJs,
    'watch:js': watchJs,
    'min:css': cssCompiler,
    'watch:css': watchCss,
    'watch:images': watchImg,
    'min:images': imageOptimize,
    'dev': parallel(watchCss, watchJs, watchImg, webServer),
    'build': series(cssCompiler, parallel(minJs, imageOptimize))
  },
)
