const {
  js: { watchJs, minJs },
  css: { cssCompiler, watchCss },
  images: { imageOptimize, watchImg }
} = require('./task/processor');

module.exports = Object.assign({},
  {
    'min:js': minJs,
    'watch:js': watchJs,
    'min:css': cssCompiler,
    'watch:css': watchCss,
    'watch:images': watchImg,
    'min:images': imageOptimize,
  },
)
