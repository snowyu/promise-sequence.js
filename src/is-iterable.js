
function isIterable(v) {
  var result = v != null;
  if (result) {
    result = Array.isArray(v);
    if (!result) {
      try {
        result = typeof obj[Symbol.iterator] === 'function';
      } catch (e) {}

    }
  }
  return result;
}

module.exports = isIterable
module.exports.default = isIterable
