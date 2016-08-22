const path = require('path');
const gulp = require('gulp');

const postcss = require('gulp-postcss');
const globImport = require('postcss-sassy-import');
const cssimport = require('postcss-import');
const nested = require('postcss-nested');
const variables = require('postcss-css-variables');
const functions = require('postcss-functions');
const autoprefix = require('autoprefixer');

const { paths, globs } = require('./config');

function compileStyles() {
  return gulp.src(path.join(paths.src.root, '*.css'))
    .pipe(postcss([
      globImport(),
      cssimport(),
      nested(),
      variables(),
      functions({ 
        functions: require('turbo-components/dist/variables')
      }),
      autoprefix()
    ]))
    .pipe(gulp.dest(paths.dest.assets));
}

function watchStyles() {
  gulp.watch(path.join(paths.src.root, globs.css), compileStyles);
}

module.exports = {
  compileStyles,
  watchStyles
};