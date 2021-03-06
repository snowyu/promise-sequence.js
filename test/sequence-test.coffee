chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()

require('../src/polyfill-finally')
sequence        = require '../src/sequence'
# Promise         = require 'any-promise'

cast            = Promise.resolve.bind(Promise)
log             = console.log.bind console

chai.use(sinonChai)

sentinel = { value: 'sentinel' }
createTask = (y) ->
  -> y

expectArgs = (expected) ->
  ->
    args = Array::slice.call(arguments)
    assert.deepEqual args, expected
    return

describe "sequence", ->
  it 'should execute tasks in order', (done)->
    sequence [createTask(1), createTask(2), createTask(3)]
    .then (result) ->
      should.exist result
      result.should.be.deep.equal [1, 2, 3]
      done()
    return

  it 'should resolve to empty array when no tasks supplied', (done)->
    sequence([], [1, 2, 3]).then (result) ->
      assert.deepEqual result, []
      done()
    return

  it 'should pass args to a single task',  (done)->
    expected = [1, 2, 3]
    tasks = sinon.spy expectArgs(expected)
    sequence(tasks, [1, 2, 3]).then (result) ->
      tasks.should.be.calledOnce
      done()
    return

  it 'should pass args to all tasks',  (done)->
    expected = [1, 2, 3]
    tasks = [expectArgs(expected), expectArgs(expected), expectArgs(expected)]

    sequence(tasks, expected).finally(done)
    return

  it 'should accept promises for args', (done)->
    expected = [1, 2, 3]
    tasks = [expectArgs(expected), expectArgs(expected), expectArgs(expected)]

    expected = [cast.call(Promise, 1), cast.call(Promise, 2), cast.call(Promise, 3)]
    sequence(tasks, expected).finally(done)
    return

  it 'should reject if task throws', ->
    sequence([(->1), (->throw sentinel)]).catch (e)->assert.equal(e, sentinel)
    return

  it 'should pass constants as task', (done)->
    tasks = [1, "abcX", null, undefined]
    sequence(tasks).then (result)->
      result.should.have.length 4
      tasks.should.be.deep.equal result
      done()
    .catch (e)->done(e)
    return
