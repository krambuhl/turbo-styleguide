module.exports = function(components, type) {
  return components.filter(component => component.category === type);
}