import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import any from '../src/any';

const assert = chai.assert;
const should = chai.should();

chai.use(sinonChai);


const rejected = Promise.reject.bind(Promise);
const resolved = Promise.resolve.bind(Promise);
const cast = resolved;
const log = console.log.bind(console);

describe("any", function() {
  it('should reject error when no inputs', function(done) {
    any()["catch"](function(err) {
      should.exist(err);
      return done();
    });
  });
  it('should reject the non-array inputs', function(done) {
    any(cast(1))["catch"](function(r) {
      should.exist(r);
      return done();
    });
  });
  it('should return undefined when zero inputs', function(done) {
    any([]).then(function(result) {
      should.not.exist(result);
      return done();
    });
  });
  it('should reject the first rejected input value if someone is rejected', function(done) {
    any([rejected(1), rejected(2), rejected(3)])["catch"](function(err) {
      err.should.be.equal(1);
      return done();
    });
  });
  it('should resolve with an input value', function(done) {
    any([1, 2, 3]).then(function(result) {
      should.exist(result);
      result.should.be.equal(1);
      return done();
    });
  });
  it('should resolve with a promised input value', function(done) {
    any([cast(1), cast(2), cast(3)]).then(function(result) {
      should.exist(result);
      result.should.be.equal(1);
      return done();
    });
  });
  it('should accept a promise for an array', function(done) {
    any(resolved([1, 2, 3]))["catch"](function(err) {
      return done(err);
    }).then(function(result) {
      assert.equal(result, 1);
      return done();
    });
  });
  it('should reject error with raiseError argument', function(done) {
    var task;
    task = sinon.spy(function(i) {
      return new Promise(function(resolve, reject) {
        if (i === 2) {
          resolve(i);
        } else {
          reject('cusError');
        }
      });
    });
    any([cast(1), cast(2), 3, 4], task, true)["catch"](function(err) {
      assert.equal(err, 'cusError');
      task.should.be.calledOnce;
      return done();
    });
  });
  return it('should skip errors until resolve a input value', function(done) {
    var task;
    task = sinon.spy(function(i) {
      return new Promise(function(resolve, reject) {
        if (i === 2) {
          resolve('2');
        } else {
          reject(new Error('hi'));
        }
      })["catch"](function() {});
    });
    any([cast(1), cast(2), 3, 4], task, true)["catch"](function(err) {
      return done(err);
    }).then(function(result) {
      should.exist(result);
      result.should.be.equal('2');
      task.should.be.calledTwice;
      return done();
    });
  });
});
