const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const helper = require('../helpers/helper')

router.post('/authenticate', controller.authenticate)
router.post('/follow/:id', helper.verifyToken, controller.postFollowUser)
router.post('/unfollow/:id', helper.verifyToken, controller.postUnfollowUser)
router.get('/user', helper.verifyToken, controller.getUser)
router.post('/posts', helper.verifyToken, controller.postPosts)
router.get('/posts/:id', controller.getPost)
router.delete('/posts/:id', helper.verifyToken, controller.deletePost)
router.post('/like/:id', helper.verifyToken, controller.postlikePost)
router.post('/unlike/:id', helper.verifyToken, controller.postunlikePost)
router.post('/comment/:id', helper.verifyToken, controller.postAddComment)
router.get('/all_posts', helper.verifyToken, controller.getAllPosts)



module.exports = router