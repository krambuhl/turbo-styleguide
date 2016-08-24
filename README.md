# turbo-styleguide

Styleguide plugin that takes component repositories and/or project component directories and builds a styleguide.  Returns a gulp stream with a pile of vinyl files for you to pipe to oblivion.


## Example

```js
const styleguide = require('turbo-styleguide');

styleguide({
    Core: require('turbo-components'),
    Demo: './dist/components'
}).pipe(gulp.dest('./dist/styleguide'));
```


## Documentation

### Styleguide(libs[, options])

#### libraries

An object defining where to find components.  Can be defined as a npm module or a directory string.  

#### options

An object that defines options. oh boy!

__render:Function__: a function defining how to render templates, which is passed raw component data.  Can be used to replace the built-in handlebars render.

__template:String__: defines the template string used to render the styleguide.


__baseStyles:Boolean__: specifices whether or not the built-in stylesheet is used.

__styles:String__: defines additional css rules to be appended after baseStyles.


## Install

```
git clone git@github.com:krambuhl/turbo-styleguide.git
cd turbo-styleguide
npm link
cd /turbo-web
npm link turbo-styleguide
```
