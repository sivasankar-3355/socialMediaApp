require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')
const path = require('path')
const jwtSecret = 'gezzal'

const authenticate = async (req, res, next) => {
    const { name, email, password } = req.body
    const accessToken = jwt.sign({ email, password }, jwtSecret)
    const user = await User.findOne({ email, password })
    if (!user) {
        await User.create({
            userName: name,
            email: email,
            password: password
        })
    }
    res.json({ token: accessToken })
}

const postFollowUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user
        const userToBeFollowed = await User.findOne({ _id: id })
        const userFollowing = await User.findOne({ email: user.email, password: user.password })
        if (userFollowing.followingIds.includes(userToBeFollowed._id)) {
            res.json({ msg: 'already following this user' })
            return 'following'
        } else if(userFollowing._id == userToBeFollowed._id){
               res.json('you cannot follow yourself')
        }else {
            userFollowing.followingIds.push(userToBeFollowed._id)
            userToBeFollowed.followedByIds.push(userFollowing._id)
            await User.updateOne({_id: userToBeFollowed._id}, {
                noOfFollowers: userToBeFollowed.noOfFollowers + 1,
                followedByIds: userToBeFollowed.followedByIds
            })
            await User.updateOne({_id: userFollowing._id}, {
                noOfFollowings: userFollowing.noOfFollowings + 1,
                followingIds: userFollowing.followingIds
            })
            const a = await User.findOne({_id: userFollowing._id})
            res.json({ msg: 'following' })
        }

    } catch (error) {
        throw new Error('error following user')
    }
}

const postUnfollowUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user
        const userToBeUnFollowed = await User.findOne({ _id: id })
        const userUnFollowing = await User.findOne({ email: user.email, password: user.password })
        if (!userUnFollowing.followingIds.includes(userToBeUnFollowed._id)) {
            res.json({ msg: 'you are not following this user' })
        } else if(userToBeUnFollowed._id == userUnFollowing._id){
           res.json({msg: 'you cannot unfollow yourself'})
        }else {
            const filteredFollowedBy  = userToBeUnFollowed.followedByIds.filter(fId => fId != userUnFollowing._id)
            const filteredFollowing = userUnFollowing.followingIds.filter(fId => fId != id)
            await User.updateOne({_id: userToBeUnFollowed._id}, { 
                noOfFollowers: userToBeUnFollowed.noOfFollowers - 1,
                followedByIds: filteredFollowedBy
            })
            await User.updateOne({_id: userUnFollowing._id}, { 
                noOfFollowings: userUnFollowing.noOfFollowings - 1,
                followingIds: filteredFollowing
            })
            res.json({ msg: 'unfollowed' })
        }
    } catch (error) {
        throw new('error unfollowing user') 
    }

}

const getUser = async (req, res, next) => {
    try {
        const user = req.user
        const appUser = await User.findOne({ email: user.email, password: user.password })
        res.json({
            name: appUser.userName,
            no_of_followers: appUser.noOfFollowers,
            no_of_followings: appUser.noOfFollowings
        })
        return 'success'
    } catch (error) {
        throw new Error('error getting user')
    }
}

const postPosts = async (req, res, next) => {
    try {
        const user = req.user
        const { title, description } = req.body
        const appUser = await User.findOne({ email: user.email, password: user.password })
        const post = await Post.create({ title, description, created_by_id: appUser._id })
        appUser.post_ids.push(post._id)
        await User.updateOne({_id: appUser._id}, { post_ids: appUser.post_ids })
        res.json({
            id: post._id,
            title: post.title, 
            description: post.description,
            created_time: post.created_at
        })
        return 'success'
    }
    catch (error) {
        res.json({ msg: 'error creating post' })
    }

}

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user
        const appUser = await User.findOne({ email: user.email, password: user.password })
        if (appUser.post_ids.includes(id)) {
            await Post.findOneAndDelete({ _id: id })
            const filteredPostIds = appUser.post_ids.filter(postId => postId != id)
            await User.updateOne({_id: appUser._id}, { post_ids: filteredPostIds })
            res.json({msg: 'post deleted'})
        } else {
            res.json({ msg: 'you do not have a post of that id to delete' })
        }
    } catch (error) {
        res.json({ msg: 'error deleting post' })
    }
}

const postlikePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user
        const appUser = await User.findOne({ email: user.email, password: user.password })
        const post = await Post.findOne({ _id: id })
        if (post.liked_by.includes(appUser._id)) {
            res.json({ msg: 'you already liked this post' })
        } else {
            post.liked_by.push(appUser._id)
            await Post.updateOne({_id: post._id}, {
                likes: post.likes + 1,
                liked_by: post.liked_by
            })
            res.json({msg: 'post liked'})
        }
    } catch (error) {
        res.json({ msg: 'error liking post' })
    }
}

const postunlikePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = req.user
        const appUser = await User.findOne({ email: user.email, password: user.password })
        const post = await Post.findOne({ _id: id })
        if (post.liked_by.includes(appUser._id)) {
            const filteredLikedBy = post.liked_by.filter(likedBy => likedBy != appUser._id)
            await Post.updateOne({_id: post._id}, {
                likes: post.likes - 1,
                liked_by: filteredLikedBy
            })
            res.json({ msg: 'unliked post successfully' })
            return 'success'
        } else {
            res.json({ msg: 'you have not liked this post to unlike' })
        }
    } catch (error) {
        res.json({ msg: 'error unliking post' })
    }
}

const postAddComment = async (req, res, next) => {
    try {
        const { id } = req.params
        const { comment } = req.body
        const user = req.user
        const post = await Post.findOne({ _id: id })
        const appUser = await User.findOne({ email: user.email, password: user.password })
        const newComment = await Comment.create({
            comment: comment,
            comment_by: appUser._id,
            post_id: post._id
        })
        post.comment_ids.push(newComment._id)
        await Post.updateOne({_id: post._id}, { comment_ids: post.comment_ids })
        res.json({ commentId: newComment._id })
        return 'success'
    } catch (error) {
        res.json({ msg: 'error adding comment' })
    }
}

const getPost = async (req, res, next) => {
    try {
        const { id } = req.params
        const post = await Post.findOne({ _id: id })
        const comments = await Comment.find({ post_id: post._id })
        res.json({
            title: post.title,
            description: post.description,
            likes: post.likes,
            comments: comments
        })
        return 'success'
    } catch (error) {
        res.json({ msg: 'error getting post' })
    }
}

const getAllPosts = async (req, res, next) => {
   try{
    const user = req.user;
    const appUser = await User.findOne({ email: user.email, password: user.password })
    const posts = await Post.find({ created_by_id: appUser._id })
    const resPosts = []
    for (let post of posts) {
        const resPost = {}
        const comments = await Comment.find({ post_id: post._id })
        resPost.id = post._id
        resPost.title = post.title
        resPost.desc = post.description
        resPost.created_at = post.created_at
        resPost.comments = comments
        resPost.likes = post.likes
        resPosts.push(resPost)
    }
    res.json({
        posts: resPosts
    })
    return 'success'
   }catch(error){
      throw new Error('error fetching posts...')
   }
}


module.exports = {
    authenticate,
    postFollowUser,
    postUnfollowUser,
    getUser,
    postPosts,
    deletePost,
    postlikePost,
    postunlikePost,
    postAddComment,
    getPost,
    getAllPosts,
}