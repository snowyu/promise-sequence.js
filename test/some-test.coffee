chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()
chai.use(sinonChai)

some            = require '../src/some'
Promise         = require 'any-promise'

cast            = Promise.cast || Promise.resolve
rejected        = Promise.reject
resolved        = Promise.resolve
log             = console.log.bind console

describe "some", ->

  it 'should reject error when no inputs', (done)->
    some().catch (err)->
      should.exist err
      done()
    return

  it 'should reject the non-array inputs', (done)->
    some cast(1)
    .catch (r)->
      should.exist r
      done()
    return

  it 'should return [] when zero inputs', (done)->
    some([]).then (result)->
      assert.deepEqual result, []
      done()
    return

  it 'should reject the first rejected input value if someone is rejected', (done)->
    some [rejected(1), rejected(2), rejected(3)], 2
    .catch (err)->
      err.should.be.equal 1
      done()
    return

  it 'should resolve with input value', (done)->
    some [1,2,3], 2
    .then (result)->
      assert.deepEqual result, [1,2]
      done()
    return

  it 'should resolve with a promised input value', (done)->
    some [cast(1),cast(2),cast(3)], 1
    .then (result)->
      assert.deepEqual result, [1]
      done()
    return

  it 'should accept a promise for an array', (done)->
    some resolved([1,2,3]), 2
    .catch (err)->
      done(err)
    .then (result)->
      assert.deepEqual result, [1,2]
      done()
    return

  it 'should reject error with raiseError argument', (done)->
    task = sinon.spy (i)->
      new Promise (resolve, reject)->
        if i == 2
          resolve i
        else
          reject(new TypeError)
    some [cast(1),cast(2),3,4], task, true
    .catch (err)->
      should.exist err
      task.should.be.calledOnce
      done()
    return

  it 'should skip errors until resolve a input value', (done)->
    task = sinon.spy (i)->
      new Promise (resolve, reject)->
        if i == 2 or i == 3
          resolve i
        else
          reject(new TypeError)
      .catch ->
    some [cast(1),cast(2),3,4], 3, task
    .then (result)->
      should.exist result
      result.should.be.deep.equal [2,3]
      task.should.be.callCount 4
      done()
    return
