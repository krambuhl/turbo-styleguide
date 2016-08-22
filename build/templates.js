const gulp = require('gulp');
const path = require('path');
const Handlebars = require('handlebars');
const through = require('through2');
const file = require('gulp-file');
const wrap = require('gulp-wrap');
const prettify = require('gulp-jsbeautifier');
const defineModule = require('gulp-define-module');
const _ = require('lodash');

const {
  getFileName,
  getFileCategory,
  getFileNamespace
} = require('turbo-components/build/file-utils');

const {
  addFileToArray,
  createIndex,
  createRequirement
} = require('turbo-components/build/utils');

const {
  paths,
  globs
} = require('./config');

const createTemplateRequirement = file => {
  const ns = getFileNamespace(file);
  const cat = getFileCategory(file);
  const name = getFileName(file);
  return createRequirement(`${cat}/${name}`, `${cat}/${ns}/${name}.js`);
};

const precompileTemplates = opts => 
  through.obj(function(file, enc, done) {
    const res = Handlebars.precompile(file.contents.toString(), {
      strict: false,
      data: false
    });

    file.contents = new Buffer(res);
    done(null, file);
  });

const matchRequirements = string => {
  // wow this actually works...
  // for the moment
  const matches = string.match(/,\"(.+?)\",{\"name\":\"component\"/gi);
  
  if (matches) {
    return _.uniq(matches.map(name => {
      return name.split('"')[1];
    }));
  }

  return [];
}

const getTemplateName = string => {
  var cat = string.substr(0, string.indexOf('/'));
  var name = string.substr(string.indexOf('/') + 1);
  var ns = name;

  if (name.indexOf('__') !== -1) {
    ns = name.substr(0, name.indexOf('__'));
  }

  if (ns.indexOf('--') !== -1) {
    ns = ns.substr(0, ns.indexOf('--'));
  }

  return { cat, ns, name };
};

const getTemplateRequirements = string => {
  return matchRequirements(string)
    .map(req => {
      var { cat, ns, name } = getTemplateName(req);
      return `Handlebars.registerPartial("${cat}/${name}", require("turbo-components/dist/${cat}/${ns}/${name}.js"));`
    })
    .join('');
};

const addTemplateRequirements = opts => 
  through.obj(function(file, enc, done) {
    var reqs = getTemplateRequirements(file.contents.toString());
    file.contents = new Buffer(reqs + file.contents.toString()); 
    done(null, file);
  });

function compileTemplates(done) {
  let templates = [];
  let requirements =  {};

  return gulp.src(path.join(paths.src.components, globs.hbs))
    .pipe(precompileTemplates())
    .pipe(addFileToArray(templates))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(defineModule('node'))
    .pipe(addTemplateRequirements())
    .pipe(wrap('var Handlebars = require("turbo-components/dist/lib/handlebars").default;<%= contents %>'))
    .pipe(prettify())
    .pipe(gulp.dest(paths.dest.root))
    .on('end', function() {
      file('templates.js', createIndex(templates, createTemplateRequirement))
        .pipe(defineModule('node'))
        .pipe(gulp.dest(paths.dest.root))
        .on('end', function() {
          done();
        });
    });
}

function watchTemplates() {
  gulp.watch(path.join(paths.src.components, globs.hbs), compileTemplates);
}

module.exports = {
  compileTemplates,
  watchTemplates
};