const rename = require('gulp-rename');
const lazypipe = require('lazypipe');
const renameFile = () => lazypipe()
  .pipe(rename, path => {
    const isSass = /.s[ac]ss$/i.test(path.extname);
    isSass ? path.basename = 'style-source' : path.basename += '.min';
  }
  )()

module.exports = renameFile;
