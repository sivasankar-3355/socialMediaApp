const authMiddleware = require('../helpers/helper').verifyToken
const {expect} = require('chai')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

describe('Auth Middleware', function(){
    it('should throw an error if no authorization header is present', function() {
        const req = {
          get: function(headerName) {
            return null
          }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
          'Not authenticated.'
        );
      });
      
    it('should throw error if authorization is only one string', function(){
        const req = {
            get: function(headerName){
                return 'abc'
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
    })

    it('should throw error for invalid token', function(){
        const req = {
            get: function(headerName){
                return 'Bearer abc'
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
    })

    it('should have user after verifying the token', function(){
        const req = {
            get: function(headerName){
                return 'Bearer fdsjfdkjsfnaskkjf'
            }
        }
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({email: 'abc@gmail.com', password: 'abc'})
        authMiddleware(req, {}, () => {})
        expect(req).to.have.property('user')
        jwt.verify.restore()
    })
})