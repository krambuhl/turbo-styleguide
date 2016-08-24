module.exports = function(str) {
  if (str.substr(str.length) === 's') {
    return str;
  }

  return str + 's';
}