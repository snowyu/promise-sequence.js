chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()
chai.use(sinonChai)

require('any-promise/register')('bluebird')

any             = require '../src/any'
Promise         = require 'any-promise'

cast            = Promise.cast || Promise.resolve
rejected        = Promise.reject
resolved        = Promise.resolve
log             = console.log.bind console

describe "any", ->

  it 'should reject error when no inputs', (done)->
    any().catch (err)->
      should.exist err
      done()

  it 'should reject the non-array inputs', (done)->
    any cast(1)
    .catch (r)->
      should.exist r
      done()

  it 'should return undefined when zero inputs', (done)->
    any([]).then (result)->
      should.not.exist result
      done()

  it 'should reject the first rejected input value if someone is rejected', (done)->
    any [rejected(1), rejected(2), rejected(3)]
    .catch (err)->
      err.should.be.equal 1
      done()

  it 'should resolve with an input value', (done)->
    any [1,2,3]
    .then (result)->
      should.exist result
      result.should.be.equal 1
      done()

  it 'should resolve with a promised input value', (done)->
    any [cast(1),cast(2),cast(3)]
    .then (result)->
      should.exist result
      result.should.be.equal 1
      done()
  it 'should accept a promise for an array', (done)->
    any resolved [1,2,3]
    .catch (err)->
      done(err)
    .then (result)->
      assert.equal result, 1
      done()

  it 'should reject error with raiseError argument', (done)->
    task = sinon.spy (i)->
      new Promise (resolve, reject)->
        if i == 2
          resolve i
        else
          reject('cusError')
        return
    any [cast(1),cast(2),3,4], task, true
    .catch (err)->
      assert.equal err, 'cusError'
      task.should.be.calledOnce
      done()

  it 'should skip errors until resolve a input value', (done)->
    task = sinon.spy (i)->
      new Promise (resolve, reject)->
        if i == 2
          resolve '2'
        else
          reject(new Error 'hi')
        return
      .catch ->
    any [cast(1),cast(2),3,4], task, true
    .catch (err)->
      done(err)
    .then (result)->
      should.exist result
      result.should.be.equal '2'
      task.should.be.calledTwice
      done()
