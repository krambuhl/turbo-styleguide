const gulp = require('gulp');
const path = require('path');
const resolve = require('resolve');

const { recacheTemplates, compilePages } = require('./pages');
const { compileStyles } = require('./styles');

const {
  globs
} = require('./config');

function watchExternal(done) {
  resolve('turbo-components', (err, res) => {
    if (err) done(err);

    // get the directory where the components are being compiled
    const base = res.substr(0, res.lastIndexOf('/'));

    gulp.watch(path.join(base, globs.js), gulp.series(recacheTemplates, compilePages));
    gulp.watch(path.join(base, globs.css), compileStyles);
    gulp.watch(path.join(base, 'variables.js'), compileStyles);

    done();
  });
}


module.exports = {
  watchExternal
}