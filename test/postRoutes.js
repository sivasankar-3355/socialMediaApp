const mongoose = require('mongoose')
const expect = require('chai').expect
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const assert = require('assert');
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const controllerFuncs = require('../controllers/controller')
require('dotenv').config()
const connectdb = require('../database/connect')

const testDb = 'mongodb+srv://siva:$iva@123@socialmediatest.rueoftc.mongodb.net/?retryWrites=true&w=majority'
chai.use(chaiAsPromised)

describe('controller functions', function () {
    it('should create a new post', async () => {
        await connectdb(testDb)
        const user = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser = await user.save()
        const req = {
            user: {
                email: savedUser.email,
                password: savedUser.password
            },
            body: {
                title: 'jodbey',
                description: 'this is jod'
            }
        }
        const res = {
            json: function (data) {

                this.id = data._id,
                    this.title = data.title,
                    this.description = data.description,
                    this.created_time = data.created_at

            }
        }
        const result = await controllerFuncs.postPosts(req, res, () => { })
        assert(result, 'success')
        await User.deleteMany({})
        await Post.deleteMany({})
        await mongoose.disconnect()
    })

    it('should delete a post', async () => {
        await connectdb(testDb)
        const user = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser = await user.save()
        const post = new Post({
            _id: '641555963c48f74724060e15',
            title: 'something',
            description: 'something new!!',
            created_by_id: savedUser._id
        })
        const savedPost = await post.save()
        const req = {
            user: {
                email: savedUser.email,
                password: savedUser.password
            },
            params: {
                id: savedPost._id
            }
        }
        const res = {
            json: function () {
                this.msg = 'post deleted'
            }
        }

        await expect(controllerFuncs.deletePost(req, res, () => { })).to.not.be.rejected
        await User.deleteMany({})
        await Post.deleteMany({})
        await mongoose.disconnect()

    })

    it('should follow a user', async () => {
        await connectdb(testDb)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const user2 = new User({
            _id: '641555953c48f74724060e15',
            userName: 'foster',
            email: 'foster@gmail.com',
            password: 'fosterbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser1 = await user1.save()
        const savedUser2 = await user2.save()
        const req = {
            params: {
                id: '641555953c48f74724060e15'
            },
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = {
            json: function () {
                this.msg = 'following'
            }
        }
        await expect(controllerFuncs.postFollowUser(req, res, () => { })).to.not.be.rejected
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    it('should unfollow a user', async () => {
        await connectdb(testDb)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const user2 = new User({
            _id: '641555953c48f74724060e15',
            userName: 'foster',
            email: 'foster@gmail.com',
            password: 'fosterbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser1 = await user1.save()
        const savedUser2 = await user2.save()
        const req = {
            params: {
                id: '641555953c48f74724060e15'
            },
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = {
            json: function () {
                this.jod = 'following'
            }
        }
        await expect(controllerFuncs.postFollowUser(req, res, () => { })).to.be.not.rejected
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    it('should like a post', async () => {
        await connectdb(testDb)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser1 = await user1.save()
        const post = new Post({
            _id: '641555963c48f74724060e15',
            title: 'something',
            description: 'something new!!',
            created_by_id: savedUser1._id
        })
        const savedPost = await post.save()

        const req = {
            params: {
                id: '641555963c48f74724060e15'
            },
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = {
            json: function () { }
        }

        await expect(controllerFuncs.postlikePost(req, res, () => { })).to.not.be.rejected
        await Post.deleteMany({})
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    it('should unlike a post', async () => {
        await connectdb(testDb)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser1 = await user1.save()
        const post = new Post({
            _id: '641555963c48f74724060e15',
            title: 'something',
            description: 'something new!!',
            created_by_id: savedUser1._id,
            liked_by: [savedUser1._id]
        })
        const savedPost = await post.save()

        const req = {
            params: {
                id: '641555963c48f74724060e15'
            },
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = {
            json: function () { }
        }

        const result = await controllerFuncs.postunlikePost(req, res, () => { })
        assert.equal(result, 'success')
        await Post.deleteMany({})
        await User.deleteMany({})
        await mongoose.disconnect()
    })

    it('should add a comment', async () => {
        await connectdb(testDb)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })

        const savedUser1 = await user1.save()
        const post = new Post({
            _id: '641555963c48f74724060e15',
            title: 'something',
            description: 'something new!!',
            created_by_id: savedUser1._id,
            comment_ids: []
        })
        const savedPost = await post.save()
        const req = {
            params: {
                id: savedPost._id
            },
            body: {
                comment: 'this is awesome'
            },
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = {
            json: function () { }
        }
        const result = await controllerFuncs.postAddComment(req, res, () => { })
        assert.equal(result, 'success')
        await User.deleteMany({})
        await Post.deleteMany({})
        await Comment.deleteMany({})
        mongoose.disconnect()
    })

    it('should get a post', async () => {
        await connectdb(testDb)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const user2 = new User({
            _id: '641555953c48f74724060e15',
            userName: 'foster',
            email: 'foster@gmail.com',
            password: 'fosterbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })

        const savedUser1 = await user1.save()
        const savedUser2 = await user2.save()
        const post = new Post({
            _id: '641555963c48f74724060e15',
            title: 'something',
            description: 'something new!!',
            created_by_id: savedUser1._id,
            comment_ids: []
        })
        const savedPost = await post.save()
        const comment = new Comment({
            _id: '541555963c48f74724060e15',
            comment: 'cool',
            post_id: savedPost._id,
            comment_by: savedUser2._id
        })
        await comment.save()
        const req = {
            params: {
                id: savedPost._id
            }
        }
        const res = { json: function () { } }
        const result = await controllerFuncs.getPost(req, res, () => { })
        assert.equal(result, 'success')
        await User.deleteMany({})
        await Post.deleteMany({})
        await Comment.deleteMany({})
        await mongoose.disconnect()
    })

    it('should fetch all posts', async () => {
        await connectdb(process.env.MONGO_URI_TEST)
        const user1 = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser1 = await user1.save()
        const post1 = new Post({
            _id: '641555963c48f74724060e15',
            title: 'something',
            description: 'something new!!',
            created_by_id: savedUser1._id,
            comment_ids: []
        })
        const post2 = new Post({
            _id: '641555963c48f74724060e11',
            title: 'something1',
            description: 'something old!!',
            created_by_id: savedUser1._id,
            comment_ids: []
        })
        await post1.save()
        await post2.save()
        const req = {
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = { json: function () { } }
        const result = await controllerFuncs.getAllPosts(req, res, () => { })
        assert.equal(result, 'success')
        await User.deleteMany({})
        await Post.deleteMany({})
        await mongoose.disconnect()
    })

    it('should get a user', async () => {
        await connectdb(testDb)
        const user = new User({
            _id: '641555953c48f74724060e14',
            userName: 'torch',
            email: 'torch@gmail.com',
            password: 'torchbhai',
            noOfFollowers: 0,
            noOfFollowings: 0,
            followedByIds: [],
            followingIds: [],
            post_ids: []
        })
        const savedUser = await user.save()
        const req = {
            user: {
                email: 'torch@gmail.com',
                password: 'torchbhai',
            }
        }
        const res = { json: function () { } }
        const result = await controllerFuncs.getUser(req, res, () => { })
        assert(result, 'success')
        await User.deleteMany({})
        await Post.deleteMany({})
        await mongoose.disconnect()
    })
})
