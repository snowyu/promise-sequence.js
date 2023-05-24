import pFinally from './finally'

// eslint-disable-next-line no-extend-native
if (Promise.prototype.finally === undefined) {Promise.prototype.finally = pFinally}
