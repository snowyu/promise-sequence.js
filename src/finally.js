/**
 * Adds a finally clause to a promise, which executes a function after the promise is settled, regardless of whether it was fulfilled or rejected.
 *
 * @internal
 * @param {function} fn The function to execute after the promise is settled.
 * @returns {Promise} - A promise that resolves with the result of the original promise, or rejects with the reason for rejection of the original promise.
 */
export

function promiseFinally (fn) {
  const onFinally = function(value) {return Promise.resolve(fn()).then(function() {return value})};
  return this.then(
    function(result) { return onFinally(result)},
    function(reason) {return onFinally(Promise.reject(reason))}
  );
}

export default promiseFinally

