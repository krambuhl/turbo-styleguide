module.exports = function(str, ...rest) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}