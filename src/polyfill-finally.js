import pFinally from './finally';

Promise.prototype.finally = Promise.prototype.finally || pFinally;
