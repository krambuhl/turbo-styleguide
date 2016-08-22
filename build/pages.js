const gulp = require('gulp');
const path = require('path');
const match = require('minimatch');
const Handlebars = require('handlebars');

const through = require('through2');

const {
  paths,
  globs
} = require('./config');

const clearCache = () => {
  // force re-require without cache :(
  Object.keys(require.cache)
    .filter(key => 
      match(key, '**/turbo-components/dist/**/*') ||
      match(key, '**/turbo/dist/**/*')
    )
    .forEach(key => {
      delete require.cache[key];
    });
};

const renderTemplate = opts => {
  return through.obj(function(file, enc, done) {
    const template = Handlebars.compile(file.contents.toString());

    file.contents = new Buffer(template({}));
    file.extname = '.html';

    done(null, file);
  });
};

function recacheTemplates(done) {
  clearCache();

  // YUCK!
  // 100ms seems to be the right amount of time
  // to wait for the cache to actually clear
  setTimeout(() => registerComponents(done), 100);
}

function registerComponents(done) {
  const componentHelpers = require('turbo-components/dist/helpers');
  const componentTemplates = require('turbo-components/dist/templates');
  const projectTemplates = require('../dist/templates');

  Handlebars.registerPartial(componentTemplates);
  Handlebars.registerPartial(projectTemplates);

  Object.keys(componentHelpers).forEach(name => {
    const helper = componentHelpers[name];
    if (helper.register) {
      helper.register(Handlebars);
    } else {
      Handlebars.registerHelper(name, helper);
    }
  });

  setTimeout(() => done(), 5);
}

function renderPages() {
  return gulp.src(path.join(paths.src.pages, globs.hbs))
    .pipe(renderTemplate())
    .pipe(gulp.dest(paths.dest.root));
}

const compilePages = gulp.series(recacheTemplates, renderPages);

function watchPages() {
  gulp.watch(path.join(paths.src.components, globs.hbs), compilePages);
  gulp.watch(path.join(paths.src.pages, globs.hbs), compilePages);
}

module.exports = {
  recacheTemplates,
  compilePages,
  watchPages
};