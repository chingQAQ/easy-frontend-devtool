require('dotenv').config({ path: './task/.env' });
const { js: { watchJs, minJs }, } = require('./task/processor');
debugger;

module.exports = Object.assign({},
  {
    'min:js': minJs,
    // 'min:css': cssCompiler,
    // 'watch:images': watchImg,
    // 'min:images': imageOptimize,
  },
)

// init

// path setting -> write 'input' & 'output' to env.

// determine os write it in env. -> like 'win32'.

// creating directory if path is exist, or next step.

// write directory path to env.
// input -> develope folder path.  ex: './src/css', './asset/images'.
// output -> dist folder path. ex: './dist/js', './public/frontend/js', './public/frontend/css'.

