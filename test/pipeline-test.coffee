chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()
chai.use(sinonChai)

sequence        = require '../src/pipeline'
# Promise         = require 'any-promise'

cast            = Promise.resolve.bind(Promise)
log             = console.log.bind console

sentinel = { value: 'sentinel' }
createTask = (y) ->
  (x)-> x+y

expectArgs = (expected) ->
  ->
    args = Array::slice.call(arguments)
    assert.deepEqual args, expected
    return

describe "pipeline", ->
  it 'should execute tasks in order', ->
    sequence [createTask('b'), createTask('c'), createTask('d')], ['a']
    .then (result) ->
      should.exist result
      result.should.be.equal 'abcd'
  it 'should resolve to initial args when no tasks supplied', ->
    sequence([], [1, 2, 3]).then (result) ->
      assert.deepEqual result, [1,2,3]
      return

  it 'should resolve to empty array when no tasks and no args supplied', ->
    sequence([]).then (result) ->
      assert.deepEqual result, []
      return

  it 'should pass args to initial task',  (done)->
    expected = [1, 2, 3]
    task = sinon.spy()
    tasks = [task]

    sequence(tasks, expected).then ->
      task.should.be.calledOnce
      assert.ok task.calledWith.apply task, expected
      done()
    .catch(done)
    return

  it 'should pass args to single task',  (done)->
    expected = [1, 2, 3]
    task = sinon.spy()

    sequence(task, expected).then ->
      task.should.be.calledOnce
      assert.ok task.calledWith.apply task, expected
      done()
    .catch(done)
    return

  it 'should allow initial args to be promises',  (done)->
    expected = [1, 2, 3]
    task = sinon.spy()
    tasks = [task]

    sequence(tasks,
    [cast.call(Promise, 1), cast.call(Promise, 2), cast.call(Promise, 3)]).then ->
      task.should.be.calledOnce
      assert.ok task.calledWith.apply task, expected
      done()
    .catch(done)
    return

  it 'should use constants as the first task',  (done)->
    expected = [1, 2, 3]
    task = sinon.spy (result)->result
    tasks = ['123', task]

    sequence(tasks, expected).then (result)->
      assert.equal result, '123'
      task.should.be.calledOnce
      assert.ok task.calledWith '123'
      done()
    .catch(done)
    return

  it 'should pass constants as task', ->
    sequence [createTask('b'), '1423', createTask('d')], ['a']
    .then (result) ->
      should.exist result
      result.should.be.equal '1423d'
