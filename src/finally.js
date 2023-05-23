export function promiseFinally (fn) {
  const onFinally = function(value) {return Promise.resolve(fn()).then(function() {return value})};
  return this.then(
    function(result) { return onFinally(result)},
    function(reason) {return onFinally(Promise.reject(reason))}
  );
}

export default promiseFinally

