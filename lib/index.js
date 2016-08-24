const fs = require('fs');
const render = require('./render');

const template = fs.readFileSync(__dirname + '/templates/styleguide.hbs');

function styleguide(libs, opts={}) {
  const options = Object.assign({
    render: render,
    template: template,
    baseStyles: true,
    styles: ''
  }, opts);

  const stream = through.obj((file, enc, next) => next(null, file));

  Promise.all(
    Object.keys(libs).map(key => {
      const lib = libs[key];
      
      if (typeof lib === 'string') {
        return parseDirectory(key, libs[key], options)
      } else {
        return parseModule(key, libs[key], options)
      } 
    });
  ).then(defs => {
    createStyleguide(defs, options)
      .forEach(file => stream.write(file));
    
    stream.end();
  });

  return stream;
}


// parse component directory into a library data model
function parseDirectory(name, lib, options) {
  return new Promise((resolve, reject) => {
    resolve({
      name: name,
      files: []
    })
  });
}

// parse component repository into a library data model
function parseModule(name, lib, options) {
  return new Promise((resolve, reject) => {
    resolve({
      name: name,
      files: []
    })
  });
}

// convert an array of data models
// into an array of vinyl files
function createStyleguide(defs, options) {
  var data 
}


module.exports = Styleguide;
