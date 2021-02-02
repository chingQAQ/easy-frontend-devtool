const compilerJs = require('./task/compilerJs');
const compilerSass = require('./task/compilerSass');
const { imageOptimize, watchImg } = require('./task/imagesmin');


module.exports = Object.assign({},
  {
    'watch:js': compilerJs,
    'min:css': compilerSass,
    'watch:images': watchImg,
    'min:images': imageOptimize,
  },
)
