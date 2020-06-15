var pFinally = require('./finally').default;
Promise.prototype.finally = Promise.prototype.finally || pFinally;
