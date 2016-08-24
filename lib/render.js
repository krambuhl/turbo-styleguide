const handlebars = require('handlebars');
const wax = require('handlebars-wax')(handlebars);

wax.helpers('./helpers/*.js');

function render(template, data) {
  return wax.compile(template)(data);
}

module.exports = render;