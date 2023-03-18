// require('dotenv').config()
// const expect = require('chai').expect
// const chai = require('chai')
// const sinon = require('sinon')
// const chaiAsPromised = require('chai-as-promised')
// const User = require('../models/user')
// const Post = require('../models/post')
// const Comment = require('../models/comment')
// const controllerFuncs = require('../controllers/controller')

// chai.use(chaiAsPromised)
// // process.env.NODE_ENV = 'test'

// describe('controller functions', function(){
//     it('getUser() should throw error if cannot find user with specified id', async () => {
//         sinon.stub(User, 'findOne')
//         User.findOne.throws()
//         const req = {
//             user: {
//                 email: 'abc@gmail.com',
//                 password: 'abc'
//             }
//         }
//         await expect(controllerFuncs.getUser(req, {}, ()=>{})).to.be.rejectedWith('error getting user')
//         User.findOne.restore()
//     })
 
//     it('postFollowUser() should throw error if cannot find user of specified id', async() => {
//         sinon.stub(User, 'findOne')
//         User.findOne.throws()
//         const req = {
//             user: {
//                 email: 'abc@gmail.com',
//                 password: 'abc'
//             }
//         }
//         await expect(controllerFuncs.postFollowUser(req, {}, ()=>{})).to.be.rejectedWith('error following user')
//         User.findOne.restore()
//     })
    
//     it('postUnFollowUser() should throw error if cannot find user of specified id', async() => {
//         sinon.stub(User, 'findOne')
//         User.findOne.throws()
//         const req = {
//             user: {
//                 email: 'abc@gmail.com',
//                 password: 'abc'
//             }
//         }
//         await expect(controllerFuncs.postUnfollowUser(req, {}, ()=>{})).to.be.rejectedWith('error unfollowing user')
//         User.findOne.restore()
//     })

// })