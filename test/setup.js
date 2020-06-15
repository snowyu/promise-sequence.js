var obj = global || window;

if (!obj.Promise) {
  obj.Promise = require('bluebird')
}
