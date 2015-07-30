chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()

sequence        = require '../src/sequence'

log             = console.log.bind console

chai.use(sinonChai)

createTask = (y) ->
  -> y


describe "sequence", ->
  it 'should execute tasks in order', ->
    sequence [createTask(1), createTask(2), createTask(3)]
    .then (result) ->
      assert.equals(result, [1, 2, 3])
