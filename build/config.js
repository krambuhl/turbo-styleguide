const paths = {
  tests: 'tests',
  src: {
    root: 'source',
    lib: 'source/lib',
    helpers: 'source/helpers',
    components: 'source/components',
    pages: 'source/pages',
    assets: 'source/assets'
  },
  dest: {
    root: 'dist',
    lib: 'dist/lib',
    helpers: 'dist/helpers',
    components: 'dist/components',
    assets: 'dist/assets'
  }
};

const globs = {
  hbs: '**/*.hbs',
  js: '**/*.js',
  css: '**/*.{css,scss}'
};

module.exports = {
  paths,
  globs
};