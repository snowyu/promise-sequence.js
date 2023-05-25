import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const assert = chai.assert;
const should = chai.should();

chai.use(sinonChai);

import '../src/polyfill-finally'

import sequence from '../src/sequence';
import {EPipeStop} from '../src/';

const cast = Promise.resolve.bind(Promise);
const log = console.log.bind(console);

chai.use(sinonChai);

const sentinel = {
  value: 'sentinel'
};

function createTask(y) {
  return function() {
    return y;
  };
};

function expectArgs(expected) {
  return function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    assert.deepEqual(args, expected);
  };
};

describe("sequence", function() {
  it('should execute tasks in order', function(done) {
    sequence([createTask(1), createTask(2), createTask(3)]).then(function(result) {
      should.exist(result);
      result.should.be.deep.equal([1, 2, 3]);
      return done();
    });
  });
  it('should resolve to empty array when no tasks supplied', function(done) {
    sequence([], [1, 2, 3]).then(function(result) {
      assert.deepEqual(result, []);
      return done();
    });
  });
  it('should pass args to a single task', function(done) {
    var expected, tasks;
    expected = [1, 2, 3];
    tasks = sinon.spy(expectArgs(expected));
    sequence(tasks, [1, 2, 3]).then(function(result) {
      tasks.should.be.calledOnce;
      return done();
    });
  });
  it('should pass args to all tasks', function(done) {
    var expected, tasks;
    expected = [1, 2, 3];
    tasks = [expectArgs(expected), expectArgs(expected), expectArgs(expected)];
    sequence(tasks, expected)["finally"](done);
  });
  it('should accept promises for args', function(done) {
    var expected, tasks;
    expected = [1, 2, 3];
    tasks = [expectArgs(expected), expectArgs(expected), expectArgs(expected)];
    expected = [cast.call(Promise, 1), cast.call(Promise, 2), cast.call(Promise, 3)];
    sequence(tasks, expected)["finally"](done);
  });
  it('should reject if task throws', function() {
    sequence([
      (function() {
        return 1;
      }), (function() {
        throw sentinel;
      })
    ])["catch"](function(e) {
      return assert.equal(e, sentinel);
    });
  });
  it('should pass constants as task', function(done) {
    var tasks;
    tasks = [1, "abcX", null, void 0];
    sequence(tasks).then(function(result) {
      result.should.have.length(4);
      tasks.should.be.deep.equal(result);
      return done();
    })["catch"](function(e) {
      return done(e);
    });
  });
  it('should execute synchronous tasks', async() => {
    const tasks = [
      function add(a, b) { return a + b },
      function subtract(a, b) { return a - b },
      function multiply(a, b) { return a * b }
    ];
    // Execute the sequence with [3, 2] arguments.
    const result = await sequence(tasks, [3, 2]);
    assert.deepEqual(result, [5, 1, 6]); // Output: [5, 1, 6]
  });
  it('should stop task if throw EPipeStop error', async function() {
    const t = async(x) => {
      const err = new EPipeStop()
      throw err
    }
    let result = await sequence([createTask(1), t, createTask(3)])
    should.exist(result);
    assert.deepEqual(result, [1]);
  });
  it('should stop task and return value if throw EPipeStop error', async function() {
    const tasks = [
      function add(a, b) { return a + b },
      function stopAndRet(a, b) {
        const err = new EPipeStop()
        // apply err.result if wanna return a result else no result returned.
        err.result = a - b
        throw err
      },
      function multiply(a, b) { return a * b }
    ];
    const result = await sequence(tasks, [3, 2]);
    assert.deepEqual(result, [5, 1]);
  });
});
