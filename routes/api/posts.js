const express = require('express');
const router = express.Router();
const {check,validationResult}=require('express-validator/check');
const auth=require('../middlewere/auth');
const Post=require('../../models/post');
const Profile=require('../../models/profile');
const User=require('../../models/User');

//@route     POST api/posts
//@desc      create post
//@ascess    private
router.post('/',
[auth,[
    check('text','text is required')
    .not()
    .isEmpty()
]
], async (req, res) => {
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post =await newPost.save()
        res.json(post)
        
    } catch (err) {
        console.error(errors.message)
        res.status(500).send('server error')
        
    }
    


});
//@route     GET api/posts
//@desc      get all post
//@ascess    private

router.get('/',auth,async(req,res)=>{
    try {
        const posts=await Post.find().sort({date:-1})
        res.json(posts)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
        
    }
})

//@route     GET api/post/id
//@desc      get all post by id
//@ascess    private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg:'profile not found'})
        }
        res.json(post)

    } catch (err) {
        console.error(err.message)
        if(err.Kind===ObjectId){
            return res.status(404).json({msg:'profile not found'})
        }
        res.status(500).send('server error')

    }
})
//@route     DELETE api/posts
//@desc      delete a post
//@ascess    private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(401).json({ msg: 'user not authorized' })
        }

        //check user
        if(post.user.toString()!==req.user.id){
            return res.status(401).json({msg:'user not authorized'})
        }
        await post.remove()
        res.json({msg:'post removed'})

    } catch (err) {
        console.error(err.message)
        if (err.Kind === ObjectId) {
            return res.status(404).json({ msg: 'profile not found' })
        }
        res.status(500).send('server error')

    }
})
//@route     PUT api/posts/like/:id
//@desc      like a post
//@ascess    private

router.put('/like/:id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        //check if the post has already been liked
        //console.log(post.likes.filter(like => like.user.toString() === req.user.id))
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg:'the is already liked'})
        } 
        post.likes.unshift({user:req.user.id})
        await post.save()
        res.json(post.likes)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
        
    }

})
//@route     PUT api/posts/like/:id
//@desc      like a post
//@ascess    private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).lenght === 0) {
            return res.status(400).json({ msg: 'post has not yet been liked' })
        }
        //Get remove index
        post.likes = post.likes.filter(
            ({ user }) => user.toString() !== req.user.id
        );
        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')

    }

})
//@route     POST api/posts/comment/:id
//@desc      comment on a post
//@ascess    private
router.post('/comment/:id',
    [auth, [
        check('text', 'text is required')
            .not()
            .isEmpty()
    ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const post=await Post.findById(req.params.id)
            // console.log(post,"post")

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment)
            // console.log(post,"hgf")
            await post.save()
            res.json(post.comments)

        } catch (err) {
            console.error(err.message)
            res.status(500).send('server error')

        }



    });

//@route     DELETE api/posts/comment/:id/:comment_id
//@desc      delete a comment on a post
//@ascess    private
router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        
        //pull out comment
        const comment=post.comments.find(comment=>comment.id===req.params.comment_id)

        //make sure comment exist
        if(!comment){
            return res.status(404).json({msg:'comment not found'})
        }

        //check user
        if(comment.user.toString()!==req.user.id){
            return res.status(401).json({msg:'user not authorized'})
        }

        //Get remove index
        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id
        );
        await post.save()
        res.json(post.comments)
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
        
    }
})




module.exports = router;