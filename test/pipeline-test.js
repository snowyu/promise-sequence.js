import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

const assert = chai.assert;
const should = chai.should();

chai.use(sinonChai);

import {pipeline as sequence, EPipeStop} from '../src/pipeline';

const cast = Promise.resolve.bind(Promise);
const log = console.log.bind(console);

const sentinel = {
  value: 'sentinel'
};

function createTask(y, self) {
  return function(x) {
    if (self) assert.equal(this, self)
    return x + y;
  };
};

function expectArgs(expected) {
  return function() {
    var args;
    args = Array.prototype.slice.call(arguments);
    assert.deepEqual(args, expected);
  };
};

describe("pipeline", function() {
  it('should execute tasks in order', function() {
    return sequence([createTask('b'), createTask('c'), createTask('d')], ['a']).then(function(result) {
      should.exist(result);
      result.should.be.equal('abcd');
    });
  });
  it('should resolve to initial args when no tasks supplied', function() {
    return sequence([], [1, 2, 3]).then(function(result) {
      assert.deepEqual(result, [1, 2, 3]);
    });
  });
  it('should resolve to empty array when no tasks and no args supplied', function() {
    return sequence([]).then(function(result) {
      assert.deepEqual(result, []);
    });
  });
  it('should pass args to initial task', function(done) {
    var expected, task, tasks;
    expected = [1, 2, 3];
    task = sinon.spy();
    tasks = [task];
    sequence(tasks, expected).then(function() {
      task.should.be.calledOnce;
      assert.ok(task.calledWith.apply(task, expected));
      return done();
    }).catch(done);
  });
  it('should pass args to single task', function(done) {
    var expected, task;
    expected = [1, 2, 3];
    task = sinon.spy();
    sequence(task, expected).then(function() {
      task.should.be.calledOnce;
      assert.ok(task.calledWith.apply(task, expected));
      return done();
    }).catch(done);
  });
  it('should allow initial args to be promises', function(done) {
    var expected, task, tasks;
    expected = [1, 2, 3];
    task = sinon.spy();
    tasks = [task];
    sequence(tasks, [cast.call(Promise, 1), cast.call(Promise, 2), cast.call(Promise, 3)]).then(function() {
      task.should.be.calledOnce;
      assert.ok(task.calledWith.apply(task, expected));
      return done();
    }).catch(done);
  });
  it('should use constants as the first task', function(done) {
    var expected, task, tasks;
    expected = [1, 2, 3];
    task = sinon.spy(function(result) {
      return result;
    });
    tasks = ['123', task];
    sequence(tasks, expected).then(function(result) {
      assert.equal(result, '123');
      task.should.be.calledOnce;
      assert.ok(task.calledWith('123'));
      done();
    }).catch(done);
  });
  it('should pass constants as task', function() {
    return sequence([createTask('b'), '1423', createTask('d')], ['a']).then(function(result) {
      should.exist(result);
      result.should.be.equal('1423d');
    });
  });
  it('should pass this into task', async function() {
    const self = 78134
    let result = await sequence([createTask('b', self), createTask('c', self), createTask('d')], ['a'], self)
    should.exist(result);
    result.should.be.equal('abcd');
  });
  it('should stop task if throw EPipeStop error', async function() {
    const t = async() => {throw new EPipeStop()}
    let result = await sequence([createTask('b'), t, createTask('d')], ['a'])
    should.exist(result);
    result.should.be.equal('ab');
  });
});
