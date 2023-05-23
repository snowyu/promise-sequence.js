import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const assert = chai.assert;
const should = chai.should();

chai.use(sinonChai);

import some from '../src/some';

const rejected = Promise.reject.bind(Promise);
const resolved = Promise.resolve.bind(Promise);
const cast = resolved;
const log = console.log.bind(console);

describe("some", function() {
  it('should reject error when no inputs', function(done) {
    some().catch(function(err) {
      should.exist(err);
      return done();
    });
  });
  it('should reject the non-array inputs', function(done) {
    some(cast(1)).catch(function(r) {
      should.exist(r);
      return done();
    });
  });
  it('should return [] when zero inputs', function(done) {
    some([]).then(function(result) {
      assert.deepEqual(result, []);
      return done();
    });
  });
  it('should reject the first rejected input value if someone is rejected', function(done) {
    some([rejected(1), rejected(2), rejected(3)], 2).catch(function(err) {
      err.should.be.equal(1);
      return done();
    });
  });
  it('should resolve with input value', function(done) {
    some([1, 2, 3], 2).then(function(result) {
      assert.deepEqual(result, [1, 2]);
      return done();
    });
  });
  it('should resolve with a promised input value', function(done) {
    some([cast(1), cast(2), cast(3)], 1).then(function(result) {
      assert.deepEqual(result, [1]);
      return done();
    });
  });
  it('should accept a promise for an array', function(done) {
    some(resolved([1, 2, 3]), 2).catch(function(err) {
      return done(err);
    }).then(function(result) {
      assert.deepEqual(result, [1, 2]);
      return done();
    });
  });
  it('should reject error with raiseError argument', function(done) {
    var task;
    task = sinon.spy(function(i) {
      return new Promise(function(resolve, reject) {
        if (i === 2) {
          return resolve(i);
        } else {
          return reject(new TypeError);
        }
      });
    });
    some([cast(1), cast(2), 3, 4], task, true).catch(function(err) {
      should.exist(err);
      task.should.be.calledOnce;
      return done();
    });
  });
  return it('should skip errors until resolve a input value', function(done) {
    var task;
    task = sinon.spy(function(i) {
      return new Promise(function(resolve, reject) {
        if (i === 2 || i === 3) {
          return resolve(i);
        } else {
          return reject(new TypeError);
        }
      }).catch(function() {});
    });
    some([cast(1), cast(2), 3, 4], 3, task).then(function(result) {
      should.exist(result);
      result.should.be.deep.equal([2, 3]);
      task.should.be.callCount(4);
      return done();
    });
  });
});
